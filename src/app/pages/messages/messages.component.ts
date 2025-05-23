import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { MessagesService } from 'src/app/services/messages.service';
import { SignalrService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  liveMessages: string[] = [];

  receiverId: string = '';
  message: string = '';

  constructor(
    private signalRService: SignalrService,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    this.signalRService.startConnection(token!);
    this.loadConversations();

    this.signalRService.onMessageReceived((senderId, message) => {
      this.liveMessages.push(`${senderId}: ${message}`);
    });
  }

  loadConversations(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.messageService.getAllConversations(userId).subscribe({
        next: (data) => {
          this.messages = data;
          console.log(`Messages succesfully loaded.`);
        },
        error: (err) => {
          console.error('Messages could not be loaded.', err);
        },
      });
    }
  }

  sendMessage(receiverId: string, message: string): void {
    const userId = localStorage.getItem('userId');

    if (userId && receiverId && message) {
      this.signalRService.sendMessage(userId, receiverId, message).then(() => {
          console.log('Message successfully sent.');
          this.message = '';
        })
        .catch(err => {
          console.error('Error sending message.', err);
        })
    }
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection();
    this.signalRService.removeMessageListener();
  }
}
