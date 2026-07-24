import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PRODUCTS_SEED } from './products.seed';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return default paginated results (page=1, limit=10)', () => {
    const result = service.getProducts({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(PRODUCTS_SEED.length);
    expect(result.data.length).toBe(Math.min(10, PRODUCTS_SEED.length));
  });

  it('should filter products by category', () => {
    const result = service.getProducts({ category: 'Electronics' });
    expect(result.data.every((p) => p.category === 'Electronics')).toBe(true);
    expect(result.total).toBe(
      PRODUCTS_SEED.filter((p) => p.category === 'Electronics').length,
    );
  });

  it('should filter products by stock_status', () => {
    const result = service.getProducts({ stock_status: 'in_stock' });
    expect(result.data.every((p) => p.stock_status === 'in_stock')).toBe(true);
    expect(result.total).toBe(
      PRODUCTS_SEED.filter((p) => p.stock_status === 'in_stock').length,
    );
  });

  it('should filter products by low_stock status', () => {
    const result = service.getProducts({ stock_status: 'low_stock' });
    expect(result.data.every((p) => p.stock_status === 'low_stock')).toBe(true);
    expect(result.total).toBe(
      PRODUCTS_SEED.filter((p) => p.stock_status === 'low_stock').length,
    );
  });

  it('should filter products by out_of_stock status', () => {
    const result = service.getProducts({ stock_status: 'out_of_stock' });
    expect(result.data.every((p) => p.stock_status === 'out_of_stock')).toBe(
      true,
    );
    expect(result.total).toBe(
      PRODUCTS_SEED.filter((p) => p.stock_status === 'out_of_stock').length,
    );
  });

  it('should filter products by both category and stock_status simultaneously', () => {
    const result = service.getProducts({
      category: 'Electronics',
      stock_status: 'in_stock',
    });
    expect(
      result.data.every(
        (p) => p.category === 'Electronics' && p.stock_status === 'in_stock',
      ),
    ).toBe(true);
    const expectedCount = PRODUCTS_SEED.filter(
      (p) => p.category === 'Electronics' && p.stock_status === 'in_stock',
    ).length;
    expect(result.total).toBe(expectedCount);
  });

  it('should handle custom pagination offset correctly', () => {
    const result = service.getProducts({ page: 2, limit: 5 });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.data.length).toBe(5);
    expect(result.data[0].id).toBe(PRODUCTS_SEED[5].id);
  });

  it('should return empty data array when page index exceeds totalPages', () => {
    const result = service.getProducts({ page: 99, limit: 10 });
    expect(result.page).toBe(99);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(PRODUCTS_SEED.length);
  });
});
