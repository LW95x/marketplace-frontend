import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProduct, Product, UpdateProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByUserId(user_id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/users/${user_id}/products`);
  }

  getSingleProduct(user_id: string, product_id: string): Observable<Product> {
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
