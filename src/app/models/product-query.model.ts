export interface ProductQuery {
  title?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
}
