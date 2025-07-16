import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    products: Product[] = [];
    userProducts: Product[] = [];
    productError: string | null = null;
    bigDealsOfTheDay: Product[] = [];
    smallDealsOfTheDay: Product[] = [];
  
    constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products succesfully loaded.');

        this.bigDealsOfTheDay = [this.products[0], this.products[3]];
        this.smallDealsOfTheDay = [this.products[1], this.products[2], this.products[4], this.products[5]];
      },
      error: (err) => {
        this.productError =
          'Products could not be found.';
          console.error(err);
      }
    })
  }
}
