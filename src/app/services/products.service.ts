import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProduct, Product, UpdateProduct } from '../models/product.model';
import { ProductQuery } from '../models/product-query.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

  getProducts(query: ProductQuery = {}): Observable<Product[]> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value != null) {
        params = params.set(key, value);
      }
    });

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getProductById(product_id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${product_id}`);
  }

  getProductsByUserId(user_id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/users/${user_id}/products`);
  }

  getSingleUserProduct(user_id: string, product_id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/users/${user_id}/products/${product_id}`);
  }

  addNewProduct(user_id: string, product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/users/${user_id}/products`, product);
  }

  updateProduct(user_id: string, product_id: string, jsonPatchDocument: UpdateProduct[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${user_id}/products/${product_id}`, jsonPatchDocument);
  }

  deleteProduct(user_id: string, product_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${user_id}/products/${product_id}`);
  }
}
