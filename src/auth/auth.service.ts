import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from './types/tokens.type';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    public configService: ConfigService,
  ) {}
  async userSignUp(user: SignUpDto): Promise<Token> {
    const existingUser = await this.userRepo.findOne({
      where: { email: user.email.toLowerCase() },
    });
    if (existingUser && existingUser.password) {
      throw new ForbiddenException('User already exists');
    }
    const hash = await this.setPassword(user.password);
    user.password = hash;
    user.email.toLowerCase();
    const newUser = await this.create(user);

    const tokens: Token = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.name,
    );
    return tokens;
  }
  async userLogin(dto: SignInDto): Promise<Token> {
    const user = await this.userRepo.findOne({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!user) throw new ForbiddenException(['Email or Password is invalid']);

    const encrypt = await this.setPassword(dto.password);
    if (encrypt === user.password) {
      const tokens = await this.getTokens(user.id, user.email, user.name);
      return tokens;
    }
    throw new ForbiddenException(['Email or Password is invalid']);
  }
  async create(user: Partial<User>) {
    return await this.userRepo.save(user);
  }
  async setPassword(password: string) {
    return createHash('md5').update(password).digest(`hex`);
  }
  async getTokens(_id: ObjectId, email: string, name: string): Promise<Token> {
    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(
        {
          _id,
          email,
          name,
        },
        {
          secret: this.configService.get('AT_TOKEN'),
          expiresIn: 60 * 30,
        },
      ),
      await this.jwtService.signAsync(
        {
          _id,
          email,
          name,
        },
        {
          secret: this.configService.get('RT_TOKEN'),
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
