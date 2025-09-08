import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const configService = app.get(ConfigService);
  const port: number = configService.get('PORT') ?? 3000;
  // Allow requests from the Next.js dev server running on localhost:3000
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  });
  await app.listen(port);
  console.log(`App is running at: ${await app.getUrl()}`);
}

bootstrap().catch((r) => console.error(r));
