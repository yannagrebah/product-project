import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductsModule } from './products/products.module';
import { DEFAULT_CACHE_TTL_MS } from './common/interceptors/cache.interceptor';

@Module({
  imports: [
    CacheModule.register({
      ttl: DEFAULT_CACHE_TTL_MS,
      max: 100,
      isGlobal: true,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
