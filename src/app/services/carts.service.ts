import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart, CreateCartItem, UpdateCart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

  getUserShoppingCart(user_id: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/users/${user_id}/cart`);
  }

  getShoppingCartItem(user_id: string, cart_item_id: string): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/users/${user_id}/cart/${cart_item_id}`);
  }

  addShoppingCartItem(user_id: string, cartItem: CreateCartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/users/${user_id}/cart`, cartItem);
  }

  updateShoppingCartItemQuantity(user_id: string, cart_item_id: string, newQuantity: number, addQuantity = false): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${user_id}/cart/${cart_item_id}?newQuantity=${newQuantity}&addQuantity=${addQuantity}`, {});
  }

  deleteShoppingCartItem(user_id: string, cart_item_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${user_id}/cart/${cart_item_id}`);
  }
}
