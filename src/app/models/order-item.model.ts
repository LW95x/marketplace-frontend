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
