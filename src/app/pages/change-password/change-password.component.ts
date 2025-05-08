import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private userService: UsersService) {}

  sendPasswordChangeRequest(
    currentPassword: string,
    newPassword: string
  ): void {
    const userId = localStorage.getItem('userId');

    if (userId && this.currentPassword && this.newPassword) {
      this.userService
        .updateUserPassword(userId, currentPassword, newPassword)
        .subscribe({
          next: () => {
            console.log('User password was succesfully updated.');
          },
          error: (err) => {
            console.error('Failed to update user password.', err);
          },
        });
    }
  }
}