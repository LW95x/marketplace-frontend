import { Component } from '@angular/core';
import { UpdateUser } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css'],
})
export class ChangeEmailComponent {
  currentEmail: string = '';
  newEmail: string = '';

  constructor(private userService: UsersService) {}

  sendEmailChangeRequest(
    newEmail: string
  ): void {
    const userId = localStorage.getItem('userId');
    const confirmedEmail = localStorage.getItem('email');
    const jsonPatchDocument: UpdateUser[] = [{
      op: 'replace',
      path: '/email',
      value: newEmail
  }];

    if (userId && 
      this.currentEmail === confirmedEmail && 
      this.newEmail &&
      this.newEmail !== this.currentEmail) {
      this.userService
        .updateUser(userId, jsonPatchDocument)
        .subscribe({
          next: () => {
            console.log('User Email was succesfully updated.');
          },
          error: (err) => {
            console.error('Failed to update user Email.', err);
          },
        });
    }
  }
}