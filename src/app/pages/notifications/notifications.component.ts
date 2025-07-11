import { Component } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notifications: Notification[] | null = null;

  constructor(private notificationService: NotificationsService) {}

  ngOnInit() {
    this.loadUserNotifications();
  }

  loadUserNotifications(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.notificationService.getAllUserNotifications(userId).subscribe({
        next: (data) => {
          this.notifications = data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          console.log('Notifications successfully loaded.');
        },
        error: (err) => console.error('Could not find user notifications', err),
      });
    }
  }

  handleDeleteNotification(notificationId: string): void {
    const userId = localStorage.getItem('userId');

    if (userId && notificationId) {
      this.notificationService.deleteUserNotification(userId, notificationId).subscribe({
        next: () => {
          if (this.notifications) {
            this.notifications = this.notifications.filter( (notification) => notification.id !== notificationId);
          }
          console.log('Notification was succesfully deleted.');
        },
        error: (err) => {
          console.log('Failed to delete notification', err);
        }
      })
    }
  }
}
