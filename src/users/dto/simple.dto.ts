import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SimpleDto {
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
}
