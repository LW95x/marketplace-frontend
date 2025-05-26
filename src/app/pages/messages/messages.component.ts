import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { MessagesService } from 'src/app/services/messages.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { v4 as uuid } from 'uuid'; 

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
    this.signalRService.startConnection();
    this.loadConversations();

    this.signalRService.onMessageReceived((msg: Message) => {
      this.messages.push(msg);
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

  sendMessage(receiverId: string, text: string): void {
    const senderId = localStorage.getItem('userId');

    if (senderId && receiverId && text) {
      this.signalRService.sendMessage(senderId, receiverId, text).then(() => {
          console.log('Message successfully sent.');
          this.messages.push({
            id: uuid(),
            content: text,
            sentTime: new Date(),
            senderId,
            receiverId,
            senderUsername: 'You',
            receiverUsername: ''
          })
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
