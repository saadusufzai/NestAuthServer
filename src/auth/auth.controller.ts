import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Token } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  userSignUp(@Body() SignUpDto: SignUpDto): Promise<Token> {
    return this.authService.userSignUp(SignUpDto);
  }

  @Post('login')
  userLogin(@Body() SignInDto: SignInDto): Promise<Token> {
    return this.authService.userLogin(SignInDto);
  }
}
