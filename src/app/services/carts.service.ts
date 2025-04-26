import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';
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

  getSingleShoppingCartItem(user_id: string, cart_item_id: string): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/users/${user_id}/cart/${cart_item_id}`);
  }
}
