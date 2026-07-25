import { create } from 'zustand';
import type {
  Product,
  ProductCategory,
  ProductStockStatus,
  PaginatedProductsResponse,
} from '@product-project/shared';

export type ViewMode = 'grid' | 'list';

export interface ProductsState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  category: ProductCategory | null;
  stock_status: ProductStockStatus | null;
  search: string;
  viewMode: ViewMode;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setCategory: (category: ProductCategory | null) => void;
  setStockStatus: (stockStatus: ProductStockStatus | null) => void;
  setSearch: (search: string) => void;
  setViewMode: (viewMode: ViewMode) => void;
  resetFilters: () => void;
  fetchProducts: () => Promise<void>;
}

export const API_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000'
).replace(/\/+$/, '');

function areProductsStructurallyEqual(a: Product[], b: Product[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every(
    (item, index) =>
      item.id === b[index].id &&
      item.name === b[index].name &&
      item.price === b[index].price &&
      item.category === b[index].category &&
      item.stock_status === b[index].stock_status &&
      item.imageUrl === b[index].imageUrl,
  );
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  category: null,
  stock_status: null,
  search: '',
  viewMode: 'grid',
  isLoading: false,
  isInitialized: false,
  error: null,

  setPage: (page: number) => {
    const numericPage = Number(page) || 1;
    set({ page: numericPage });
    void get().fetchProducts();
  },

  setLimit: (limit: number) => {
    const numericLimit = Number(limit) || 10;
    set({ limit: numericLimit, page: 1 });
    void get().fetchProducts();
  },

  setCategory: (category: ProductCategory | null) => {
    set({ category, page: 1 });
    void get().fetchProducts();
  },

  setStockStatus: (stock_status: ProductStockStatus | null) => {
    set({ stock_status, page: 1 });
    void get().fetchProducts();
  },

  setSearch: (search: string) => {
    const currentSearch = get().search;
    if (currentSearch === search) return;
    set({ search, page: 1 });
    void get().fetchProducts();
  },

  setViewMode: (viewMode: ViewMode) => {
    set({ viewMode });
  },

  resetFilters: () => {
    set({ category: null, stock_status: null, search: '', page: 1 });
    void get().fetchProducts();
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    const { page, limit, category, stock_status, search, products: currentProducts } = get();

    const numericPage = Number(page) || 1;
    const numericLimit = Number(limit) || 10;

    const params = new URLSearchParams();
    params.set('page', numericPage.toString());
    params.set('limit', numericLimit.toString());

    if (category) {
      params.set('category', category);
    }
    if (stock_status) {
      params.set('stock_status', stock_status);
    }
    if (search && search.trim() !== '') {
      params.set('search', search.trim());
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/products?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }
      const data = (await response.json()) as PaginatedProductsResponse;

      // Retain existing array reference if returned product list is structurally identical
      const isIdentical = areProductsStructurallyEqual(currentProducts, data.data);
      const stableProducts = isIdentical ? currentProducts : data.data;

      set({
        products: stableProducts,
        total: Number(data.total) || 0,
        page: Number(data.page) || numericPage,
        limit: Number(data.limit) || numericLimit,
        totalPages: Number(data.totalPages) || 1,
        isLoading: false,
        isInitialized: true,
      });
    } catch (err) {
      set({
        isLoading: false,
        isInitialized: true,
        error:
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching products',
      });
    }
  },
}));
