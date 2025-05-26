import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Message } from 'src/app/models/message.model';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private connection: signalR.HubConnection | null = null;

    startConnection(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://u2umarketplace-api.azurewebsites.net/messagehub', {
        transport: signalR.HttpTransportType.LongPolling,
        accessTokenFactory: () => localStorage.getItem('token')!
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

  onMessageReceived(callback: (msg: Message) => void): void {
    this.connection?.on('ReceiveMessage', callback);
  }

  sendMessage(senderId: string, receiverId: string, content: string): Promise<void> {
    return this.connection!.invoke('SendMessage', senderId, receiverId, content)
    .catch(err => {
      console.error('Error sending message:', err);
    })
  }

  removeMessageListener(): void {
    this.connection?.off('ReceiveMessage');
  }
}
