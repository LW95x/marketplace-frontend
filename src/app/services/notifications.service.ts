import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateNotification, Notification } from '../models/notification.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

  getAllUserNotifications(user_id: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/users/${user_id}/notifications`);
  }

  getSingleUserNotification(user_id: string, notification_id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/users/${user_id}/notifications/${notification_id}`);
  }

  addUserNotification(user_id: string, notification: CreateNotification): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/users/${user_id}/notifications`, notification);
  }

  deleteUserNotification(user_id: string, notification_id: string): Observable<Notification> {
    return this.http.delete<Notification>(`${this.apiUrl}/users/${user_id}/notifications/${notification_id}`);
  }
}
