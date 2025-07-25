import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  title: string = '';

  constructor(
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.formBuilder.group({
      category: [undefined],
      minPrice: [undefined],
      maxPrice: [undefined],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.title = params['title'] || '';
      this.loadProducts(this.filterForm.value);
    })

    this.filterForm.valueChanges.subscribe((vals) => {
      this.loadProducts(vals);
    });
  }

  loadProducts(filters: any): void {
    const fullPayload = {
      ...filters,
      title: this.title,
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

  search(): void {
    const filters = this.filterForm.value;
    this.loadProducts(filters);
  }
}
