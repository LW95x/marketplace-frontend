import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrder, CreatePaymentIntent, Order, UpdateOrder } from '../models/order.model';
import { SoldItem } from '../models/order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

  getOrdersByUserId(user_id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/users/${user_id}/orders`);
  }

  getSingleOrder(user_id: string, order_id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/users/${user_id}/orders/${order_id}`);
  }

  getSavedItems(user_id: string): Observable<SoldItem[]> {
    return this.http.get<SoldItem[]>(`${this.apiUrl}/users/${user_id}/orders/sold-items`);
  }

  addNewOrder(user_id: string, order: CreateOrder): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/users/${user_id}/orders`, order);
  }

  updateOrder(user_id: string, order_id: string, jsonPatchDocument: UpdateOrder[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${user_id}/orders/${order_id}`, jsonPatchDocument);
  }

  deleteOrder(user_id: string, order_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${user_id}/orders/${order_id}`);
  }

  createPaymentIntent(user_id: string, paymentIntentDto: CreatePaymentIntent): Observable<CreatePaymentIntent> {
    return this.http.post<CreatePaymentIntent>(`${this.apiUrl}/users/${user_id}/orders/create-payment-intent`, paymentIntentDto);
  }
}
