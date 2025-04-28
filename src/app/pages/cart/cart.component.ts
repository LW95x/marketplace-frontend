import { Component } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { CartsService } from 'src/app/services/carts.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  quantity = 1;
  userCart: Cart | null = null;
  cartError: string | null = null;

  constructor(private cartService: CartsService, private productService: ProductsService) {}

  ngOnInit() {
    this.loadShoppingCart();
  }

  loadShoppingCart(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.cartService.getUserShoppingCart(userId).subscribe({
        next: (data) => {
          this.userCart = data;

          this.userCart.items.forEach(item => {
            this.productService.getProductById(item.productId).subscribe({
              next: (product) => {
                item.productName = product.sellerName;
                item.description = product.description;
                item.category = product.category;
                item.imageUrls = product.imageUrls;
                item.sellerName = product.sellerName;
              },
              error: (err) => console.error(err)
            });
          })
        },
        error: (err) => {
          this.cartError = 'Shopping Cart could not be found.';
          console.error(err);
        }
      })
    }
  }

  increment() {
    this.quantity++;
  }
  
  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
