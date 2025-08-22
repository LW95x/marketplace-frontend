export interface CartItem {
  cartItemId: string;
  quantity: number;
  totalPrice: number;
  price: number;
  productId: string;
  productName?: string;
  description?: string;
  imageUrls?: string[];
  sellerName?: string;
  category?: string;
  sellerId?: string;
}
