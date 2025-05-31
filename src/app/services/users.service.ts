import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUser, UpdateUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'https://u2umarketplace-api.azurewebsites.net';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getSingleUser(user_id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${user_id}`);
  }

  getUserByUserName(userName: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/username?username=${userName}`);
  }

  addNewUser(user: CreateUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(
    user_id: string,
    jsonPatchDocument: UpdateUser[]
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/users/${user_id}`,
      jsonPatchDocument,
      {
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      }
    );
  }

  updateUserPassword(
    user_id: string,
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/users/${user_id}/change-password?currentPassword=${currentPassword}&newPassword=${newPassword}`,
      {}
    );
  }

  deleteUser(user_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${user_id}`);
  }
}
