export interface OrderItem {
  orderItemId: string;
  productId: string;
  orderId: string;
  quantity: number;
  totalPrice: number;
  price: number;
  productTitle?: string;
  productDescription?: string;
  imageUrls?: string[];
  productSellerName?: string;
  productCategory?: string;
  productSellerId?: string;
}

export interface SoldItem {
  productId: string;
  title: string;
  category: string;
  description: string;
  address: string;
  quantity: number;
  price: number;
  totalPrice: number;
  buyerName: string;
  orderDate: string;
  status: 'Pending' | 'Completed' | 'Shipped' | 'Cancelled';
}
