import { NestFactory } from '@nestjs/core';
// import * as morgan from "morgan";
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: console,
    snapshot: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny'));
  app.enableCors({ origin: true });

  await app.listen(process.env.port || 8085);
}
bootstrap();
