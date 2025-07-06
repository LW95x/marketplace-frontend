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

  constructor(private messageService: MessagesService) {}

  ngOnInit(): void {
    this.loadConversations();
    
  }

  loadConversations(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.messageService.getAllConversations(userId).subscribe({
        next: (data) => {
          this.conversations = data.sort(
            (a, b) =>
              new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime()
          );
          console.log(this.conversations.map(c => c.sentTime));
          console.log(`Messages succesfully loaded.`);
        },
        error: (err) => {
          console.error('Messages could not be loaded.', err);
        },
      });
    }
  }
}
