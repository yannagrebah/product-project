import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import type {
  Product,
  PaginatedProductsResponse,
} from '../src/products/products.interface';

describe('Products E2E Matrix', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const getHttpServer = () =>
    app.getHttpServer() as Parameters<typeof request>[0];

  it('GET /products - default pagination parameters (page=1, limit=10)', async () => {
    const response = await request(getHttpServer())
      .get('/products')
      .expect(200);

    const body = response.body as PaginatedProductsResponse;
    expect(response.headers['x-cache']).toBe('MISS');
    expect(body).toHaveProperty('data');
    expect(body.page).toBe(1);
    expect(body.limit).toBe(10);
    expect(body.data.length).toBeLessThanOrEqual(10);
  });

  it('GET /products - duplicate query dispatch evaluates with X-Cache: HIT', async () => {
    // First call MISS
    await request(getHttpServer())
      .get('/products?category=Clothing')
      .expect(200)
      .expect('X-Cache', 'MISS');

    // Second call HIT
    await request(getHttpServer())
      .get('/products?category=Clothing')
      .expect(200)
      .expect('X-Cache', 'HIT');
  });

  it('GET /products - filtering parameter with pagination offset', async () => {
    const res = await request(getHttpServer())
      .get('/products?category=Food&page=1&limit=2')
      .expect(200);

    const body = res.body as PaginatedProductsResponse;
    expect(body.page).toBe(1);
    expect(body.limit).toBe(2);
    expect(body.data.length).toBe(2);
    expect(body.data.every((p: Product) => p.category === 'Food')).toBe(true);
  });

  it('GET /products - invalid query params (page < 1) returns 400 Bad Request', async () => {
    await request(getHttpServer()).get('/products?page=0').expect(400);
  });

  it('GET /products - invalid category returns 400 Bad Request', async () => {
    await request(getHttpServer())
      .get('/products?category=InvalidCategory')
      .expect(400);
  });

  it('GET /products - forbidden non-whitelisted params return 400 Bad Request', async () => {
    await request(getHttpServer())
      .get('/products?unknownField=hacked')
      .expect(400);
  });

  it('GET /products - combining both category and stock_status returns filtered results', async () => {
    const res = await request(getHttpServer())
      .get('/products?category=Electronics&stock_status=in_stock')
      .expect(200);

    const body = res.body as PaginatedProductsResponse;
    expect(
      body.data.every(
        (p: Product) =>
          p.category === 'Electronics' && p.stock_status === 'in_stock',
      ),
    ).toBe(true);
  });
});
