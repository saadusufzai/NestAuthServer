import { NestFactory } from '@nestjs/core';
// import * as morgan from "morgan";
import * as winston from 'winston';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const { printf } = winston.format;

  printf((info) => {
    if (info instanceof Error) {
      return `${info.timestamp} [ ${info.level} ]: ${info.message} ${info.stack}`;
    }

    return `${info.timestamp} [ ${info.level} ]: ${info.message}`;
  });

   winston.format((info) => {
    if (info.private) {
      return false;
    }
    return info;
  });

  const app = await NestFactory.create(AppModule, {
    logger: console,
    snapshot: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  // app.use(morgan("tiny"));
  app.enableCors({ origin: true });

  await app.listen(process.env.port || 8085);
}
bootstrap();
