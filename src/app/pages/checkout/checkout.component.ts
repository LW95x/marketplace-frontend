import { Component, ViewChild } from '@angular/core';
import {
  StripeCardElementOptions,
  StripeElement,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { Cart } from 'src/app/models/cart.model';
import { CreateOrder, CreatePaymentIntent } from 'src/app/models/order.model';
import { CartsService } from 'src/app/services/carts.service';
import { OrdersService } from 'src/app/services/orders.service';

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
  stripePaymentId: string = '';

  isLoading = false;
  paymentError: string | null = null;
  isSuccess = false;

  constructor(
    private stripeService: StripeService,
    private orderService: OrdersService,
    private cartService: CartsService
  ) {}

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
                      address: 'Address',
                      stripePaymentId: this.stripePaymentId,
                    };

                    this.orderService.addNewOrder(userId, orderDto).subscribe({
                      next: (order) => {
                        this.isLoading = false;
                        this.isSuccess = true;
                        console.log('Order was successfully created.');
                        this.orderService.updateOrder(userId, order.orderId, [{ path: 'status', op: 'replace', value: 'Completed' }]).subscribe({
                          next: () => {
                            console.log('Order status updated to completed.');
                          },
                          error: (err) => {
                            console.error('Failed to update order status', err);
                          }
                        })
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
    const postcodeRegex =  /^([A-Za-z]{2}[\d]{1,2}[A-Za-z]?)[\s]+([\d][A-Za-z]{2})$/;

    return postcodeRegex.test(convertedPostcode);
  }
}
