import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrder, Order, UpdateOrder } from '../models/order.model';

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

  addNewOrder(user_id: string, order: CreateOrder): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/users/${user_id}/orders`, order);
  }

  updateOrder(user_id: string, order_id: string, jsonPatchDocument: UpdateOrder[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${user_id}/orders/${order_id}`, jsonPatchDocument);
  }
}
