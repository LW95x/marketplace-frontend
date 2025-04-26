import { CartItem } from './cart-item.model';

export interface Cart {
  cartId: string;
  totalPrice: number;
  buyerId: string;
  items: CartItem[];
}

export interface UpdateCart {
  path: string;
  op: 'replace';
  value: any;
}
