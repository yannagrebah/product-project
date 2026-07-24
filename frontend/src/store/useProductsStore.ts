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

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';

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
    set({ page });
    void get().fetchProducts();
  },

  setLimit: (limit: number) => {
    set({ limit, page: 1 });
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

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

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
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
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
