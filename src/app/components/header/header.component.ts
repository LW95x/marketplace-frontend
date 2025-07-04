import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loggedIn = false;

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedIn = true;
    }
  }

  logoutConfirmation(): void {
    const confirmation = confirm('Are you sure you want to log out?');
    if (confirmation) {
      localStorage.removeItem('token');
      this.loggedIn = false;
      window.location.href = '/login';
    }
  }
}
