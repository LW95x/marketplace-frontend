import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products: Product[] = [];
  userProducts: Product[] = [];
  productError: string | null = null;
  filterForm: FormGroup;
  selectedCategory?: string;
  currentPage = 1;

  constructor(
    private productService: ProductsService,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      category: [undefined],
      minPrice: [undefined],
      maxPrice: [undefined],
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((vals) => {
      this.loadProducts(vals);
    });

    this.loadProducts(this.filterForm.value);
  }

  loadProducts(filters: any): void {
    const fullPayload = {
      ...filters,
      pageNumber: this.currentPage,
    };
    this.productService.getProducts(fullPayload).subscribe({
      next: (data) => {
        this.products = data;
        console.log('Filtered products succesfully loaded.');
      },
      error: (err) => {
        this.productError = 'Filtered products could not be found.';
        console.error(err);
      },
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.loadProducts(this.filterForm.value);
  }

  previousPage(): void {
    this.currentPage--;
    this.loadProducts(this.filterForm.value);
  }
}
