import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { JwtGuard } from './auth/guards/auth.guard';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './auth/Interceptors/transform.interceptor';
import { AppLoggerMiddleware } from './utils/looger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.HOST,
      port: 27017,
      database: process.env.DATABASE,
      synchronize: true,
      entities: [User],
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes(
        { path: 'user/:idx', method: RequestMethod.GET },
        { path: 'auth/:idx', method: RequestMethod.POST },
      );
  }
}
