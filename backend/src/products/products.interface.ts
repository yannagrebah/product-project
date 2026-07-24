export type ProductCategory = 'Electronics' | 'Clothing' | 'Food';

export type ProductStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  stock_status: ProductStockStatus;
  imageUrl: string;
}

export interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
