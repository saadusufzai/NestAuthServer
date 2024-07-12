import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async UserSignUp(user: SignUpDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { email: user.email.toLowerCase() },
    });
    if (existingUser && existingUser.password) {
      throw new ForbiddenException('User already exists');
    }
    const hash = await this.setPassword(user.password);
    user.password = hash;
    const newUser = await this.create(user);
    return newUser;
  }

  async create(user: Partial<User>) {
    return await this.userRepo.save(user);
  }
  async setPassword(password: string) {
    return createHash('md5').update(password).digest(`hex`);
  }

}
