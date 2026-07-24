import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductListItem } from './ProductListItem';
import type { Product } from '@product-project/shared';

describe('ProductListItem', () => {
  const mockProduct: Product = {
    id: 101,
    name: 'Organic Green Tea',
    category: 'Food',
    price: 14.5,
    stock_status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-tea',
  };

  it('renders list item content correctly', () => {
    render(<ProductListItem product={mockProduct} index={0} />);

    expect(screen.getByText('Organic Green Tea')).toBeDefined();
    expect(screen.getByText('Food')).toBeDefined();
    expect(screen.getByText('$14.50')).toBeDefined();
    expect(screen.getByText('In Stock')).toBeDefined();
    expect(screen.getByText('#101')).toBeDefined();
  });
});
