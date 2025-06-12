import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css'],
})
export class UserProductsComponent {
  userProducts: Product[] = [];
  productError: string | null = null;

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.loadAllUserProducts();
  }

  loadAllUserProducts(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.productService.getProductsByUserId(userId).subscribe({
        next: (data) => {
          this.userProducts = data;
        },
        error: (err) => {
          this.productError = 'Products could not be found.';
          console.error(err);
        },
      });
    }
  }

  handleDeletion(product: Product): void {
    const userId = localStorage.getItem('userId');
    const productId = product.productId;

    const confirmDelete = window.confirm('Are you sure you want to delete this product?');

    if (userId && productId && confirmDelete) {
      this.productService.deleteProduct(userId, productId).subscribe({
        next: () => {
          if (this.userProducts) {
            this.userProducts = this.userProducts.filter((product) => product.productId !== productId);
          }

          console.log('Product was succesfully deleted.');
        },
        error: (err) => {
          console.error('Failed to delete product.', err);
        },
      });
    }
  }
}
