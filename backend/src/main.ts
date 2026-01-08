import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import addValidationPipe from './extentions/addValidationPipe';
import addOpenApi from './extentions/addOpenApi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  addValidationPipe(app);
  if (process.env.APP_ENV === 'dev') {
    addOpenApi(app);
  }
  await app.listen(3000);
}

bootstrap();
