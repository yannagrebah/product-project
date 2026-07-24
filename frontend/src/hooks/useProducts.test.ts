// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProducts } from './useProducts';
import { useProductsStore } from '../store/useProductsStore';

describe('useProducts hook', () => {
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

  it('should trigger initial fetch and return product state', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Smart Watch',
        category: 'Electronics' as const,
        price: 200,
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

    const { result } = renderHook(() => useProducts());

    expect(fetchSpy).toHaveBeenCalled();
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
  });

  it('should expose filter setters and refetch capability', async () => {
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

    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.setCategory('Clothing');
    });

    expect(result.current.category).toBe('Clothing');

    act(() => {
      result.current.setStockStatus('in_stock');
    });

    expect(result.current.category).toBe('Clothing');
    expect(result.current.stock_status).toBe('in_stock');

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.category).toBeNull();
    expect(result.current.stock_status).toBeNull();
  });
});
