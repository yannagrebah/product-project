import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { Product } from '@product-project/shared';

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: 42,
    name: 'Wireless Noise Canceling Headphones',
    category: 'Electronics',
    price: 199.99,
    stock_status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-headphones',
  };

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} index={0} />);

    expect(
      screen.getByText('Wireless Noise Canceling Headphones'),
    ).toBeDefined();
    expect(screen.getByText('Electronics')).toBeDefined();
    expect(screen.getByText('$199.99')).toBeDefined();
    expect(screen.getByText('In Stock')).toBeDefined();
    expect(screen.getByText('#42')).toBeDefined();
  });

  it('renders low stock badge appropriately', () => {
    const lowStockProduct: Product = {
      ...mockProduct,
      stock_status: 'low_stock',
    };
    render(<ProductCard product={lowStockProduct} index={1} />);

    expect(screen.getByText('Low Stock')).toBeDefined();
  });

  it('renders out of stock badge appropriately', () => {
    const outOfStockProduct: Product = {
      ...mockProduct,
      stock_status: 'out_of_stock',
    };
    render(<ProductCard product={outOfStockProduct} index={2} />);

    expect(screen.getByText('Out of Stock')).toBeDefined();
  });
});
