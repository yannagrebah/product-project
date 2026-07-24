import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response, Request } from 'express';
import * as crypto from 'crypto';

export const DEFAULT_CACHE_TTL_MS = 60000; // 60 seconds TTL

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method !== 'GET') {
      return undefined;
    }
    const params = new URLSearchParams();
    const path = request.path || request.url.split('?')[0];
    Object.entries(request.query || {}).forEach(([key, value]) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (typeof val === 'object') {
            params.append(key, JSON.stringify(val));
          } else {
            params.append(key, String(val));
          }
        });
      } else if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    });
    params.sort();
    const sortedQueryString = params.toString();

    const rawCacheKey = `${path}?${sortedQueryString}`;
    const hash = crypto.createHash('md5').update(rawCacheKey).digest('hex');
    return `products_cache:${hash}`;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<Response>();
    const cachedValue = await this.cacheManager.get(key);

    if (cachedValue !== undefined && cachedValue !== null) {
      response.setHeader('X-Cache', 'HIT');
      return of(cachedValue);
    }

    response.setHeader('X-Cache', 'MISS');
    return next.handle().pipe(
      tap((value: unknown) => {
        void this.cacheManager.set(key, value, DEFAULT_CACHE_TTL_MS);
      }),
    );
  }

  async clearCache(): Promise<void> {
    const store = this.cacheManager as unknown as Record<string, unknown>;
    if (typeof store.clear === 'function') {
      await (store.clear as () => Promise<void>)();
    } else if (typeof store.reset === 'function') {
      await (store.reset as () => Promise<void>)();
    }
  }
}
