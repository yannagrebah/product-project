import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  HttpCacheInterceptor,
  DEFAULT_CACHE_TTL_MS,
} from '../common/interceptors/cache.interceptor';

@Module({
  imports: [
    CacheModule.register({
      ttl: DEFAULT_CACHE_TTL_MS,
      max: 100,
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, HttpCacheInterceptor],
  exports: [ProductsService, HttpCacheInterceptor],
})
export class ProductsModule {}
