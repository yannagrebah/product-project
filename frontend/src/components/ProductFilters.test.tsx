import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductFilters } from './ProductFilters';
import { useProductsStore } from '../store/useProductsStore';

describe('ProductFilters', () => {
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
      error: null,
    });
    vi.restoreAllMocks();
  });

  it('renders filter headings and controls', () => {
    render(<ProductFilters />);

    expect(screen.getByText('Filter & Search Criteria')).toBeDefined();
    expect(screen.getByPlaceholderText('Search by product name...')).toBeDefined();
  });

  it('updates local search input on change', () => {
    render(<ProductFilters />);

    const searchInput = screen.getByPlaceholderText(
      'Search by product name...',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Laptop' } });

    expect(searchInput.value).toBe('Laptop');
  });

  it('switches view mode when Grid / List buttons are clicked', () => {
    render(<ProductFilters />);

    const gridBtn = screen.getByTitle('Grid View');
    const listBtn = screen.getByTitle('List View');

    fireEvent.click(listBtn);
    expect(useProductsStore.getState().viewMode).toBe('list');

    fireEvent.click(gridBtn);
    expect(useProductsStore.getState().viewMode).toBe('grid');
  });

  it('renders Reset button when active filters exist and clears them on click', () => {
    useProductsStore.setState({ category: 'Electronics', search: 'Watch' });

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

    render(<ProductFilters />);

    const resetBtn = screen.getByText('Reset');
    expect(resetBtn).toBeDefined();

    fireEvent.click(resetBtn);

    const state = useProductsStore.getState();
    expect(state.category).toBeNull();
    expect(state.search).toBe('');
  });
});
