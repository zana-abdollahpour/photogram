import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.setGlobalPrefix('api');

  const uploadPath = join(__dirname, '../../uploads');
  app.useStaticAssets(uploadPath, { prefix: '/uploads' });

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
