import { CartItem } from './cart-item.model';

export interface Cart {
  cartId: string;
  totalPrice: number;
  buyerId: string;
  items: CartItem[];
}

export interface CreateCartItem {
  productId: string;
  quantity: number;
}

export interface UpdateCart {
  path: string;
  op: 'replace';
  value: any;
}
