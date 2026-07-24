import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import type { Express } from 'express';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';

let expressApp: Express;

async function getExpressApp(): Promise<Express> {
  if (!expressApp) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
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
    expressApp = app.getHttpAdapter().getInstance() as Express;
  }
  return expressApp;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const app = await getExpressApp();

    return new Promise<Response>((resolve, reject) => {
      const url = new URL(request.url);
      const socket = new Socket();

      const req = new IncomingMessage(socket);
      req.url = url.pathname + url.search;
      req.method = request.method;

      for (const [key, value] of request.headers.entries()) {
        req.headers[key.toLowerCase()] = value;
      }

      const res = new ServerResponse(req);
      const chunks: Uint8Array[] = [];

      // Intercept response writes

      res.write = (chunk: any, encoding?: any) => {
        if (chunk) {
          if (typeof chunk === 'string') {
            chunks.push(
              Buffer.from(
                chunk,
                typeof encoding === 'string' ? encoding : 'utf8',
              ),
            );
          } else if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
            chunks.push(chunk);
          }
        }
        return true;
      };

      res.end = ((chunk?: any, encoding?: any) => {
        if (chunk) {
          if (typeof chunk === 'string') {
            chunks.push(
              Buffer.from(
                chunk,
                typeof encoding === 'string' ? encoding : 'utf8',
              ),
            );
          } else if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
            chunks.push(chunk);
          }
        }

        const rawHeaders = res.getHeaders();
        const headers = new Headers();
        for (const [key, val] of Object.entries(rawHeaders)) {
          if (val !== undefined) {
            if (Array.isArray(val)) {
              val.forEach((v) => headers.append(key, String(v)));
            } else {
              headers.set(key, String(val));
            }
          }
        }

        const bodyBuffer = Buffer.concat(chunks);
        resolve(
          new Response(bodyBuffer, {
            status: res.statusCode || 200,
            headers,
          }),
        );
      }) as typeof res.end;

      try {
        app(req, res);
        if (
          request.method !== 'GET' &&
          request.method !== 'HEAD' &&
          request.body
        ) {
          // If request body exists, stream it to req
          request
            .arrayBuffer()
            .then((buf) => {
              req.push(Buffer.from(buf));
              req.push(null);
            })
            .catch(reject);
        } else {
          req.push(null);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
};
