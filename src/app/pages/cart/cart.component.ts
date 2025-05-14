import { Component } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item.model';
import { Cart, UpdateCart } from 'src/app/models/cart.model';
import { CartsService } from 'src/app/services/carts.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  userCart: Cart | null = null;
  cartError: string | null = null;

  constructor(
    private cartService: CartsService,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.loadShoppingCart();
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
              },
              error: (err) => console.error(err),
            });
          });
        },
        error: (err) => {
          this.cartError = 'Shopping Cart could not be found.';
          console.error(err);
        },
      });
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

  increment(cartItem: CartItem) {
    const previousQuantity = cartItem.quantity;
    cartItem.quantity++;

    if (this.userCart) {
      this.userCart.totalPrice += cartItem.price;
    }

    this.editShoppingCartItemQuantity(cartItem, previousQuantity, false);
  }

  decrement(cartItem: CartItem) {
    const previousQuantity = cartItem.quantity;
    if (cartItem.quantity > 1) {
      cartItem.quantity--;

      if (this.userCart) {
        this.userCart.totalPrice -= cartItem.price;
      }

      this.editShoppingCartItemQuantity(cartItem, previousQuantity, false);
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
