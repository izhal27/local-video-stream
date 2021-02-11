import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'typeorm';
import { NotFoundExceptionFilter } from './exceptions/not-found-exception-filter';
import { AllExceptionsFilter } from './exceptions/all-exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(3000);
}
bootstrap();
