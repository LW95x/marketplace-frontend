import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { MessagesService } from 'src/app/services/messages.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { UsersService } from 'src/app/services/users.service';
import { v4 as uuid } from 'uuid'; 

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnDestroy {
  receiverId!: string;
  conversation: Message[] = [];
  user!: User;

  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessagesService,
    private signalRService: SignalrService,
    private userService: UsersService
  ) {}

 ngOnInit(): void {
    this.signalRService.startConnection();
    this.receiverId = this.route.snapshot.paramMap.get('id')!;  
    if (this.receiverId) {
      this.loadSingleConversation();
      this.loadSingleUser();
  
      this.signalRService.onMessageReceived((msg: Message) => {
        this.conversation.push(msg);
      });
    } else {
      console.error('Receiver ID could not be fetched from route parameters');
    }
 }

 loadSingleConversation(): void {
  const userId = localStorage.getItem('userId');

  if (userId) {
    this.messageService.getSingleConversation(userId, this.receiverId).subscribe({
      next: (data) => {
        this.conversation = data;
        console.log('Conversation successfully loaded.');
      },
      error: (err) => {
        console.error('Conversation could not be loaded.', err);
      }
    })
  }
 }

 loadSingleUser(): void {
  if (this.receiverId) {
    this.userService.getSingleUser(this.receiverId).subscribe({
      next: (data) => {
        this.user = data;
        console.log('User successfully loaded.');
      },
      error: (err) => {
        console.error('User could not be loaded.', err);
      }
    })
  }
 }

   sendMessage(text: string): void {
    const senderId = localStorage.getItem('userId');

    const tempMsg: Message = {
      id: uuid(),
      content: text,
      sentTime: new Date(),
      senderId: senderId!,
      receiverId: this.receiverId,
      senderUsername: 'You',
      receiverUsername: ''
    }

    this.conversation.push(tempMsg);
    this.message = '';

    if (senderId && this.receiverId && text) {
      this.signalRService.sendMessage(senderId, this.receiverId, text).then(() => {
          console.log('Message successfully sent.');
        })
        .catch(err => {
          this.conversation = this.conversation.filter(m => m.id !== tempMsg.id);
          console.error('Error sending message.', err);
        })
    }
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection();
    this.signalRService.removeMessageListener();
  }
}
