import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddSavedItem, SavedItem } from '../models/saved-item.model';

@Injectable({
  providedIn: 'root'
})
export class SavedItemsService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

    getSavedItems(userId: string): Observable<SavedItem[]> {
      return this.http.get<SavedItem[]>(`${this.apiUrl}/users/${userId}/saved-items`);
    }

    getSingleSavedItem(userId: string, productId: string): Observable<SavedItem> {
      return this.http.get<SavedItem>(`${this.apiUrl}/users/${userId}/saved-items/${productId}`);
    }

    addSavedItem(userId: string, savedItem: AddSavedItem): Observable<SavedItem> {
      return this.http.post<SavedItem>(`${this.apiUrl}/users/${userId}/saved-items?productId=${savedItem.productId}`, savedItem);
    }
    
    deleteSavedItem(userId: string, productId: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/users/${userId}/saved-items/${productId}`);
    }
}
