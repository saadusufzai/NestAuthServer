import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserDto } from './dto/getUser.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/authentication/AuthGuard/JwtAuthGuard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  getUserStatus(@Request() req: User): Promise<User> {
    return this.usersService.getUserStatus(req);
  }
}
