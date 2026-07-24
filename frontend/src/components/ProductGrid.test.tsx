import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';
import { useProductsStore } from '../store/useProductsStore';

describe('ProductGrid', () => {
  beforeEach(() => {
    useProductsStore.setState({
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
      isInitialized: true,
      error: null,
    });

    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
          }),
          { status: 200 },
        ),
      ),
    );
  });

  it('renders products list when available', () => {
    useProductsStore.setState({
      products: [
        {
          id: 1,
          name: 'Smart Watch Series 7',
          category: 'Electronics',
          price: 299.99,
          stock_status: 'in_stock',
          imageUrl: 'https://images.unsplash.com/photo-1',
        },
      ],
      total: 1,
      isLoading: false,
      isInitialized: true,
    });

    render(<ProductGrid />);

    expect(screen.getByText('Smart Watch Series 7')).toBeDefined();
    expect(screen.getByText('$299.99')).toBeDefined();
  });

  it('renders empty state when no products match filters and loading is finished', () => {
    useProductsStore.setState({
      products: [],
      total: 0,
      category: 'Electronics',
      isLoading: false,
      isInitialized: true,
    });

    render(<ProductGrid />);

    expect(screen.getByText('No matching products')).toBeDefined();
  });

  it('renders error banner when error state occurs', () => {
    useProductsStore.setState({
      products: [],
      error: 'Network connection error',
      isLoading: false,
      isInitialized: true,
    });

    render(<ProductGrid />);

    expect(screen.getByText('Unable to load products')).toBeDefined();
    expect(screen.getByText('Retry Connection')).toBeDefined();
  });
});
