import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateCartItem } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';
import { AddSavedItem } from 'src/app/models/saved-item.model';
import { CartsService } from 'src/app/services/carts.service';
import { ProductsService } from 'src/app/services/products.service';
import { SavedItemsService } from 'src/app/services/saved-items.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  productId!: string;
  product!: Product;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartsService,
    private savedItemService: SavedItemsService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => (this.product = data),
      error: (err) => console.error('Product ID couldnt be found:', err),
    });
  }

  handleAddToCart(product: Product, quantity: number): void {
    const userId = localStorage.getItem('userId');

    const cartItem: CreateCartItem = {
      productId: product.productId,
      quantity: quantity,
    };

    if (userId && product) {
      this.cartService.addShoppingCartItem(userId, cartItem).subscribe({
        next: () => {
          console.log('Product succesfully added to shopping cart.');
        },
        error: (err) => {
          console.error('Failed to add product to shopping cart', err);
        },
      });
    }
  }

  handleSavedItem(product: Product): void {
    const userId = localStorage.getItem('userId');

    if (userId && product) {
      const addSavedItem: AddSavedItem = {
      productId: product.productId,
      userId: userId
    }

    this.savedItemService.addSavedItem(userId, addSavedItem).subscribe({
      next: () => {
        console.log('Product succesfully added to saved item list.');
      },
      error: (err) => {
        console.error('Failed to add product to saved item list', err);
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

  onQuantityChange(value: number) {
    const max = this.product.quantity ?? 1;
    this.quantity = Math.min(Math.max(value, 1), max);
  }
}
