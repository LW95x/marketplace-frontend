import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net'

  constructor(private http: HttpClient) { }

  login(userName: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      userName,
      password
    },
  { responseType: 'text' }
    );
  }
}
