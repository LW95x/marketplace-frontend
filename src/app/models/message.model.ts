export interface Message {
  id: string;
  content: string;
  sentTime: Date;
  senderId: string;
  receiverId: string;
  senderUsername: string;
  receiverUsername: string;
}
