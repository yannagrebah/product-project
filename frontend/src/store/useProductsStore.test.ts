import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProductsStore } from './useProductsStore';

describe('useProductsStore', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      category: null,
      stock_status: null,
      isLoading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const state = useProductsStore.getState();
    expect(state.products).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.page).toBe(1);
    expect(state.limit).toBe(10);
    expect(state.category).toBeNull();
    expect(state.stock_status).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should preserve stock_status when setting category (multi-criteria filtering)', () => {
    useProductsStore.setState({ stock_status: 'in_stock' });

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

    useProductsStore.getState().setCategory('Electronics');

    const state = useProductsStore.getState();
    expect(state.category).toBe('Electronics');
    expect(state.stock_status).toBe('in_stock');
    expect(state.page).toBe(1);
  });

  it('should preserve category when setting stock_status (multi-criteria filtering)', () => {
    useProductsStore.setState({ category: 'Clothing' });

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

    useProductsStore.getState().setStockStatus('low_stock');

    const state = useProductsStore.getState();
    expect(state.category).toBe('Clothing');
    expect(state.stock_status).toBe('low_stock');
    expect(state.page).toBe(1);
  });

  it('should reset all filters cleanly', () => {
    useProductsStore.setState({ category: 'Food', stock_status: 'in_stock', page: 3 });

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

    useProductsStore.getState().resetFilters();

    const state = useProductsStore.getState();
    expect(state.category).toBeNull();
    expect(state.stock_status).toBeNull();
    expect(state.page).toBe(1);
  });

  it('should fetch products with combined filters query parameters', async () => {
    useProductsStore.setState({ category: 'Electronics', stock_status: 'in_stock' });

    const mockProducts = [
      {
        id: 1,
        name: 'Headphones',
        category: 'Electronics' as const,
        price: 100,
        stock_status: 'in_stock' as const,
        imageUrl: 'https://images.unsplash.com/photo-1',
      },
    ];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: mockProducts,
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          }),
          { status: 200 },
        ),
      ),
    );

    await useProductsStore.getState().fetchProducts();

    const state = useProductsStore.getState();
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('category=Electronics'),
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('stock_status=in_stock'),
    );
    expect(state.products).toEqual(mockProducts);
    expect(state.total).toBe(1);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
