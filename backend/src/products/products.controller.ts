import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';
import type { PaginatedProductsResponse } from './products.interface';
import { HttpCacheInterceptor } from '../common/interceptors/cache.interceptor';

@Controller('products')
@UseInterceptors(HttpCacheInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query() query: GetProductsDto): PaginatedProductsResponse {
    return this.productsService.getProducts(query);
  }
}
