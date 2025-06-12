import { Component } from '@angular/core';
import { EmailRequest } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  email: string = '';
  confirmEmail: string = '';

  constructor(private userService: UsersService) {}

  sendEmailRequest(email: string, confirmEmail: string): void {

    const emailRequest: EmailRequest = {
      email: email,
      clientAppUrl: "http://localhost:4200"
    };

    if ( 
      this.email &&
      this.confirmEmail &&
      this.email == this.confirmEmail) {
        this.userService.sendEmailRequest(emailRequest).subscribe({
          next: () => {
            console.log('Reset password email sent.');
          },
          error: (err) => {
            console.error('Failed to send reset password request.', err);
          }
        });
    }
  }
}
