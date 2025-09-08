import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT') ?? 3000);
}

bootstrap().catch((r) => console.error(r));
