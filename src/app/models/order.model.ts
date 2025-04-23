import { OrderItem } from './order-item.model';
import { OrderStatus } from './order-status.enum';

export interface Order {
  orderId: string;
  orderItems: OrderItem[];
  status: OrderStatus;
  date: string;
  totalPrice: number;
  address: string;
  buyerId: string;
}

export interface CreateOrder {
  address: string;
}

export interface UpdateOrder {
  
}
