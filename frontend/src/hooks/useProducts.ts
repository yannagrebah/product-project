import { useEffect } from 'react';
import { useProductsStore, type ViewMode } from '../store/useProductsStore';
import type {
  Product,
  ProductCategory,
  ProductStockStatus,
} from '@product-project/shared';

export interface UseProductsReturn {
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
  error: string | null;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setCategory: (category: ProductCategory | null) => void;
  setStockStatus: (stockStatus: ProductStockStatus | null) => void;
  setSearch: (search: string) => void;
  setViewMode: (viewMode: ViewMode) => void;
  resetFilters: () => void;
  refetch: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const {
    products,
    total,
    page,
    limit,
    totalPages,
    category,
    stock_status,
    search,
    viewMode,
    isLoading,
    error,
    setPage,
    setLimit,
    setCategory,
    setStockStatus,
    setSearch,
    setViewMode,
    resetFilters,
    fetchProducts,
  } = useProductsStore();

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    total,
    page,
    limit,
    totalPages,
    category,
    stock_status,
    search,
    viewMode,
    isLoading,
    error,
    setPage,
    setLimit,
    setCategory,
    setStockStatus,
    setSearch,
    setViewMode,
    resetFilters,
    refetch: fetchProducts,
  };
}
