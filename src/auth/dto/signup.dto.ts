import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password Must Be:\n• Minimum length of 8 characters\n• Contains at least 1 letter.\n• Contains at least 1 number.\n• Contains at least 1 special character.',
    },
  )
  password: string;
}
