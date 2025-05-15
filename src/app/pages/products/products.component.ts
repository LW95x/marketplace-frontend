import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Product[] = [];
  userProducts: Product[] = [];
  productError: string | null = null;

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products succesfully loaded.');
      },
      error: (err) => {
        this.productError =
          'Products could not be found.';
          console.error(err);
      }
    })
  }
}
