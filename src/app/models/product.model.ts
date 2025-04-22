export interface Product {
  productId: string;
  title: string;
  description: string;
  price: number | null;
  quantity: number;
  category: string;
  sellerName: string;
  sellerId: string;
  imageUrls: string[];
}

export interface CreateProduct {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrls: string[];
}
