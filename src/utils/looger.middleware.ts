import {
  Injectable,
  NestMiddleware,
  Logger,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe();
  }
  use(request: Request, response: Response, next: NextFunction): void {
    const { method, path: url } = request;
    let token = request.get('authorization') || '';
    token = token.replace('Bearer ', '');
    token = token.replace(/\s+/g, '');
    const userInfo = jwt.decode(token);

    // const textSplit = '206.84.152.45 , 172.31.43.17';

    response.on('close', async () => {
      const { statusCode } = response;
      const ipAddress = (request.headers['x-forwarded-for'] || '')
        .toString()
        .split(',')
        .shift()
        .trim();
      if (statusCode < 300 && statusCode >= 200) {
        this.logger.log(
          `ipAddress:${ipAddress}[${method}]${url} statusCode:${statusCode} userInfo: ${JSON.stringify(
            userInfo,
          )} `,
        );
      }
      //
    });

    next();
  }
}
