export interface Notification {
  id: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  userId: string;
  url: string;
}

export interface CreateNotification {
  message: string;
  url: string;
}
