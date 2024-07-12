import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}
  async getUserStatus(@Request() req): Promise<User> {
    const user = await this.UserRepository.findOne({
      where: { email: req.user.email },
    });
    return user;
  }
}
