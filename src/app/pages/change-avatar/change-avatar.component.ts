import { Component } from '@angular/core';
import { UpdateUser } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent {
  selectedFile: File | null = null;

constructor(private userService: UsersService) {}

onFileSelect(event: Event): void {
  const file = event.target as HTMLInputElement;
  if (file.files) {
    this.selectedFile = file.files[0];
  }
}

  sendAvatarChangeRequest(): void {
    const userId = localStorage.getItem('userId');
    const jsonPatchDocument: UpdateUser[] = [{
      op: 'replace',
      path: '/avatar',
      value: this.selectedFile
  }];

    if (userId) {
      this.userService
        .updateUser(userId, jsonPatchDocument)
        .subscribe({
          next: () => {
            console.log('User Avatar was succesfully updated.');
          },
          error: (err) => {
            console.error('Failed to update user Avatar.', err);
          },
        });
    }
  }
}
