import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  lastname: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @MinLength(10, {
    message:
      'password must have a minimum length of 12 characters. We highly recommend password managers.',
  })
  password: string;
}
