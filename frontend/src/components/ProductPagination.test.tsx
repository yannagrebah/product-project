import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductPagination } from './ProductPagination';
import { useProductsStore } from '../store/useProductsStore';

describe('ProductPagination', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: [
        {
          id: 1,
          name: 'Item 1',
          category: 'Electronics',
          price: 10,
          stock_status: 'in_stock',
          imageUrl: 'https://images.unsplash.com/photo-1',
        },
      ],
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
      category: null,
      stock_status: null,
      search: '',
      viewMode: 'grid',
      isLoading: false,
      error: null,
    });
    vi.restoreAllMocks();

    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: [],
            total: 25,
            page: 2,
            limit: 10,
            totalPages: 3,
          }),
          { status: 200 },
        ),
      ),
    );
  });

  it('renders pagination details and page range', () => {
    render(<ProductPagination />);

    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getByText('25')).toBeDefined();
    expect(screen.getByText('Next')).toBeDefined();
  });

  it('navigates to next page on Next button click', () => {
    render(<ProductPagination />);

    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);

    expect(useProductsStore.getState().page).toBe(2);
  });
});
