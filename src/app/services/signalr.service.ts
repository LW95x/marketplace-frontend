import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private connection: signalR.HubConnection | null = null;

    startConnection(token: string): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://u2umarketplace-api.azurewebsites.net/messagehub', {
        accessTokenFactory: () => token
      }) 
      .withAutomaticReconnect()
      .build();

    this.connection
      .start()
      .then(() => {
        console.log('SignalR connection has started.')
    })
      .catch(err => {
        console.error('Error starting SignalR connection:', err)
    });
  }

  stopConnection(): void {
    this.connection?.stop();
  }

  onMessageReceived(callback: (user: string, message: string) => void): void {
    this.connection?.on('ReceiveMessage', callback);
  }

  sendMessage(senderId: string, receiverId: string, content: string): void {
    this.connection?.invoke('SendMessage', senderId, receiverId, content)
      .catch(err => {
        console.error('Error sending message:', err)
  });
  }

  removeMessageListener(): void {
    this.connection?.off('ReceiveMessage');
  }
}
