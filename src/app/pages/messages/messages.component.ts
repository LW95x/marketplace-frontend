import { Component } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {
  conversations: Message[] = [];
  userId: string | null = null;

  constructor(private messageService: MessagesService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.loadConversations();
  }

  loadConversations(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.messageService.getAllConversations(userId).subscribe({
        next: data => {
          const sorted = [...data].sort(
            (a, b) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime()
          );

    const seen = new Set<string>();
    const removedDupes = sorted.filter(msg => {
      const key = [msg.senderId, msg.receiverId]
        .map(id => id.trim().toLowerCase())
        .sort()
        .join('-');

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    this.conversations = removedDupes;
  },
  error: err => console.error(err)
});
  }
}
}