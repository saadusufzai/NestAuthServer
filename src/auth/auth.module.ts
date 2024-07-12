import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtGuardStrategy } from './guards/jwt-auth.strategy';
import { JwtGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, JwtGuardStrategy, JwtGuard],
})
export class AuthModule {}
