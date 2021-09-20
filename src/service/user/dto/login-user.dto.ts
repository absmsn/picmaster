import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  // @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
