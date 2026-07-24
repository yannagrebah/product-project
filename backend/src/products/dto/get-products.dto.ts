import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type {
  ProductCategory,
  ProductStockStatus,
} from '../products.interface';

export class GetProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be greater than or equal to 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be greater than or equal to 1' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['Electronics', 'Clothing', 'Food'], {
    message: 'category must be one of: Electronics, Clothing, Food',
  })
  category?: ProductCategory;

  @IsOptional()
  @IsEnum(['in_stock', 'low_stock', 'out_of_stock'], {
    message: 'stock_status must be one of: in_stock, low_stock, out_of_stock',
  })
  stock_status?: ProductStockStatus;
}
