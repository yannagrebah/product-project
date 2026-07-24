import { Injectable } from '@nestjs/common';
import { Product, PaginatedProductsResponse } from './products.interface';
import { GetProductsDto } from './dto/get-products.dto';
import { PRODUCTS_SEED } from './products.seed';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = PRODUCTS_SEED;

  getProducts(query: GetProductsDto): PaginatedProductsResponse {
    const { page = 1, limit = 10, category, stock_status } = query;

    let filteredProducts = this.products;

    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category,
      );
    }

    if (stock_status) {
      filteredProducts = filteredProducts.filter(
        (p) => p.stock_status === stock_status,
      );
    }

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = filteredProducts.slice(startIndex, startIndex + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
