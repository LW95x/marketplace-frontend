export interface SavedItem {
    Id: string;
    productId: string;
    userId: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    sellerName: string;
    imageUrls: string[];
}

export interface AddSavedItem {
    productId: string;
    userId: string;
}