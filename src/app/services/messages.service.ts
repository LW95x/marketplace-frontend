import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

  getSingleConversation(user_id: string, receiver_id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/users/${user_id}/messages/${receiver_id}`);
  }

  getAllConversations(user_id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/users/${user_id}/messages`);
  }

  deleteMessage(user_id: string, message_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${user_id}/messages/${message_id}`);
  }
}
