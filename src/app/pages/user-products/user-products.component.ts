import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css']
})
export class UserProductsComponent {
    userProducts: Product[] = [];
    userProduct: Product = {} as Product;
    productError: string | null = null;

    constructor(private productService: ProductsService) {}

    ngOnInit() {
      this.loadAllUserProducts();
      this.loadUserProduct();
    }

    loadAllUserProducts(): void {
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        this.productService.getProductsByUserId(userId).subscribe({
          next: (data) => {
            this.userProducts = data;
          },
          error: (err) => {
            this.productError =
            'Products could not be found.';
            console.error(err);
          }
        })
      }
    }

    loadUserProduct(): void {
      const userId = localStorage.getItem('userId');
      const productId = '015ff32c-1b9b-4292-98de-08dd4ee7e16e'; // Just for testing purposes, replace from parametric endpoint for singular user product.

      if (userId) {
        // Not working because I'm passing in the wrong user for testing purposes, needs to be product related to that user.
        this.productService.getSingleUserProduct(userId, productId).subscribe({
          next: (data) => {
            this.userProduct = data;
            console.log(this.userProduct);
          },
          error: (err) => {
            this.productError =
              'User Product could not be found.';
              console.error(err);
          }
        })
      }
    }
}
