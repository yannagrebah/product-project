import { create } from 'zustand';
import type {
  Product,
  ProductCategory,
  ProductStockStatus,
  PaginatedProductsResponse,
} from '@product-project/shared';

export interface ProductsState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  category: ProductCategory | null;
  stock_status: ProductStockStatus | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setCategory: (category: ProductCategory | null) => void;
  setStockStatus: (stockStatus: ProductStockStatus | null) => void;
  resetFilters: () => void;
  fetchProducts: () => Promise<void>;
}

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  category: null,
  stock_status: null,
  isLoading: false,
  error: null,

  setPage: (page: number) => {
    set({ page });
    void get().fetchProducts();
  },

  setLimit: (limit: number) => {
    set({ limit, page: 1 });
    void get().fetchProducts();
  },

  setCategory: (category: ProductCategory | null) => {
    // Multi-criteria filtering: set category without clearing stock_status
    set({ category, page: 1 });
    void get().fetchProducts();
  },

  setStockStatus: (stock_status: ProductStockStatus | null) => {
    // Multi-criteria filtering: set stock_status without clearing category
    set({ stock_status, page: 1 });
    void get().fetchProducts();
  },

  resetFilters: () => {
    set({ category: null, stock_status: null, page: 1 });
    void get().fetchProducts();
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    const { page, limit, category, stock_status } = get();

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (category) {
      params.set('category', category);
    }
    if (stock_status) {
      params.set('stock_status', stock_status);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/products?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }
      const data = (await response.json()) as PaginatedProductsResponse;
      set({
        products: data.data,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching products',
      });
    }
  },
}));
