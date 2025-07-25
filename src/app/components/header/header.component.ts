import { Component } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loggedIn = false;
  notificationCount: number = 0;
  userName: string | null = '';
  title: string = '';

  constructor(private notificationService: NotificationsService, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedIn = true;
    }
    this.userName = localStorage.getItem('username');
  }

  ngOnInit() {
    this.loadUserNotifications();
  }

  loadUserNotifications(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.notificationService.getAllUserNotifications(userId).subscribe({
        next: (data) => {
          const count = data.length;
          localStorage.setItem('notificationCount', count.toString());
          this.notificationCount = count;
          console.log('Notifications successfully loaded.');
        },
        error: (err) => console.error('Could not find user notifications', err),
      });
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

  search(): void {
    if (this.title && this.title.trim()) {
      this.router.navigate(['/products'], { queryParams: { title: this.title }});
    }
  }
}
