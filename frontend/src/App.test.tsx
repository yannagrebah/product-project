import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { useProductsStore } from './store/useProductsStore';

describe('App Integration', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: [
        {
          id: 1,
          name: 'Wireless Noise-Canceling Headphones',
          category: 'Electronics',
          price: 299.99,
          stock_status: 'in_stock',
          imageUrl: 'https://images.unsplash.com/photo-1',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      category: null,
      stock_status: null,
      search: '',
      viewMode: 'grid',
      isLoading: false,
      error: null,
    });

    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: [
              {
                id: 1,
                name: 'Wireless Noise-Canceling Headphones',
                category: 'Electronics',
                price: 299.99,
                stock_status: 'in_stock',
                imageUrl: 'https://images.unsplash.com/photo-1',
              },
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          }),
          { status: 200 },
        ),
      ),
    );
  });

  it('renders application header, description, and footer correctly', async () => {
    render(<App />);

    expect(await screen.findByText('PRODUCT CATALOG')).toBeDefined();
    expect(
      await screen.findByText(
        /Explore our high-performance product catalog featuring real-time debounced search/i,
      ),
    ).toBeDefined();
    expect(await screen.findByText('yannagrebah')).toBeDefined();
  });
});
