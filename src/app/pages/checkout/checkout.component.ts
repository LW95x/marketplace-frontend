import { Component, ViewChild } from '@angular/core';
import {
  StripeCardElementOptions,
  StripeElement,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { CartItem } from 'src/app/models/cart-item.model';
import { Cart } from 'src/app/models/cart.model';
import { CreateNotification } from 'src/app/models/notification.model';
import { CreateOrder, CreatePaymentIntent } from 'src/app/models/order.model';
import { CartsService } from 'src/app/services/carts.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  elementsOptions: StripeElementsOptions = { locale: 'en-GB' };
  cardOptions: StripeCardElementOptions = {
    hidePostalCode: false,
    style: { base: { fontSize: '16px' } },
  };
  houseNumber: string = '';
  street: string = '';
  postCode: string = '';
  cart: Cart | null = null;
  userCart: Cart | null = null;
  stripePaymentId: string = '';

  isLoading = false;
  paymentError: string | null = null;
  isSuccess = false;

  previousQuantities: { [cartItemId: string]: number } = {};

  constructor(
    private stripeService: StripeService,
    private orderService: OrdersService,
    private cartService: CartsService,
    private notificationService: NotificationsService,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.loadShoppingCart();
  }

  pay() {
    const userId = localStorage.getItem('userId');

    if (!userId || !this.card?.element) {
      this.paymentError = 'Missing user or card details.';
      console.error('Missing User ID or card details.');
      return;
    }

    this.paymentError = null;
    this.isLoading = true;

    const convertedPostcode = this.postCodeConverter(this.postCode);

    if (!this.postCodeChecker(convertedPostcode)) {
      console.error('Post Code provided was in an invalid format.');
      this.paymentError = 'Post Code provided was invalid.';
      this.isLoading = false;
      return;
    }

    this.cartService.getUserShoppingCart(userId).subscribe({
      next: (data) => {
        this.cart = data;
        console.log('Successfully fetched users shopping cart.');

        if (!this.cart) {
          this.isLoading = false;
          this.paymentError = 'Your cart is empty.';
          return;
        }

        const paymentIntentDto: CreatePaymentIntent = {
          amount: Math.round(this.cart.totalPrice * 100),
          currency: 'gbp',
        };

        this.orderService
          .createPaymentIntent(userId, paymentIntentDto)
          .subscribe({
            next: (response) => {
              const clientSecret = response.clientSecret;
              if (!clientSecret) {
                this.isLoading = false;
                this.paymentError = 'Payment could not be processed';
                return;
              }

              this.stripeService
                .confirmCardPayment(clientSecret, {
                  payment_method: {
                    card: this.card.element!,
                  },
                })
                .subscribe({
                  next: (result) => {
                    const paymentIntent = result.paymentIntent;
                    if (!paymentIntent) {
                      this.isLoading = false;
                      this.paymentError = 'Payment failed to process.';
                      return;
                    }
                    this.stripePaymentId = paymentIntent.id;

                    const orderDto: CreateOrder = {
                      address:
                        this.houseNumber +
                        ', ' +
                        this.street +
                        ', ' +
                        this.postCode,
                      stripePaymentId: this.stripePaymentId,
                    };

                    this.orderService.addNewOrder(userId, orderDto).subscribe({
                      next: (order) => {
                        this.isLoading = false;
                        this.isSuccess = true;
                        console.log('Order was successfully created.');

                        const notificationOrderPlaced: CreateNotification = {
                          message: `Your order was succesfully placed!`,
                          url: `/orders`,
                        };

                        this.notificationService
                          .addUserNotification(userId, notificationOrderPlaced)
                          .subscribe({
                            next: () => {
                              console.log('Notification successfully sent.');
                            },
                          });

                        this.orderService
                          .updateOrder(userId, order.orderId, [
                            {
                              path: 'status',
                              op: 'replace',
                              value: 'Completed',
                            },
                          ])
                          .subscribe({
                            next: () => {
                              console.log('Order status updated to completed.');
                            },
                            error: (err) => {
                              console.error(
                                'Failed to update order status',
                                err
                              );
                            },
                          });
                      },
                      error: (err) => {
                        this.isLoading = false;
                        this.paymentError = 'Order creation has failed.';
                        console.error('Order creation failed', err);
                      },
                    });
                  },
                  error: (err) => {
                    this.isLoading = false;
                    this.paymentError =
                      err?.error?.message || 'Payment confirmation failed.';
                    console.error('Payment confirmation error:', err);
                  },
                });
            },
            error: (err) => {
              this.isLoading = false;
              this.paymentError = 'Could not create payment intent.';
              console.error('Create Payment Intent error:', err);
            },
          });
      },
      error: (err) => {
        this.isLoading = false;
        this.paymentError = 'Could not fetch users shopping cart.';
        console.error('Could not fetch users shopping cart.', err);
      },
    });
  }

  postCodeConverter(postCode: string): string {
    const convertedString = (postCode || '').toUpperCase().replace(/\s+/g, '');
    if (convertedString.length < 5) return convertedString;
    return `${convertedString.slice(0, -3)} ${convertedString.slice(-3)}`;
  }

  postCodeChecker(convertedPostcode: string): boolean {
    const postcodeRegex =
      /^([A-Za-z]{2}[\d]{1,2}[A-Za-z]?)[\s]+([\d][A-Za-z]{2})$/;

    return postcodeRegex.test(convertedPostcode);
  }

  loadShoppingCart(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.cartService.getUserShoppingCart(userId).subscribe({
        next: (data) => {
          this.userCart = data;

          this.userCart.items.forEach((item) => {
            this.productService.getProductById(item.productId).subscribe({
              next: (product) => {
                item.productName = product.title;
                item.description = product.description;
                item.category = product.category;
                item.imageUrls = product.imageUrls;
                item.sellerName = product.sellerName;
                item.sellerId = product.sellerId;
              },
              error: (err) => console.error(err),
            });
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  increment(cartItem: CartItem) {
    const previousQuantity = cartItem.quantity;
    cartItem.quantity++;

    if (this.userCart) {
      this.userCart.totalPrice += cartItem.price;
      cartItem.totalPrice = cartItem.price * cartItem.quantity;
    }

    this.editShoppingCartItemQuantity(cartItem, previousQuantity, false);
  }

  decrement(cartItem: CartItem) {
    const previousQuantity = cartItem.quantity;
    if (cartItem.quantity > 1) {
      cartItem.quantity--;

      if (this.userCart) {
        this.userCart.totalPrice -= cartItem.price;
        cartItem.totalPrice = cartItem.price * cartItem.quantity;
      }

      this.editShoppingCartItemQuantity(cartItem, previousQuantity, false);
    }
  }

  editShoppingCartItemQuantity(
    cartItem: CartItem,
    previousQuantity: number,
    addQuantity = false
  ): void {
    const userId = localStorage.getItem('userId');
    const cartItemId = cartItem.cartItemId;

    if (userId && cartItemId) {
      this.cartService
        .updateShoppingCartItemQuantity(
          userId,
          cartItemId,
          cartItem.quantity,
          addQuantity
        )
        .subscribe({
          next: () => {
            console.log('Cart Item quantity successfully updated.');
          },
          error: (err) => {
            cartItem.quantity = previousQuantity;

            if (this.userCart) {
              const difference =
                cartItem.price * (cartItem.quantity - previousQuantity);
              this.userCart.totalPrice -= difference;

              console.error('Failed to update Cart Item quantity.', err);
            }
          },
        });
    }
  }

  onQuantityChange(cartItem: CartItem, previousQuantity: number): void {
    const newQuantity = Number(cartItem.quantity);

    if (newQuantity !== previousQuantity && cartItem.quantity > 0) {
      const priceDiff = (newQuantity - previousQuantity) * cartItem.price;

      if (this.userCart) {
        this.userCart.totalPrice += priceDiff;
      }

      this.editShoppingCartItemQuantity(cartItem, previousQuantity);
      cartItem.quantity = newQuantity;
    } else {
      cartItem.quantity = previousQuantity;
    }
  }

  handleDeletion(cartItem: CartItem): void {
    const userId = localStorage.getItem('userId');
    const cartItemId = cartItem.cartItemId;

    if (userId && cartItemId) {
      this.cartService.deleteShoppingCartItem(userId, cartItemId).subscribe({
        next: () => {
          if (this.userCart) {
            this.userCart.items = this.userCart.items.filter(
              (item) => item.cartItemId !== cartItemId
            );

            this.userCart.totalPrice -= cartItem.totalPrice
          }
          console.log('Cart Item was succesfully deleted.');
        },
        error: (err) => {
          console.error('Failed to delete Cart Item', err);
        },
      });
    }
  }
}
