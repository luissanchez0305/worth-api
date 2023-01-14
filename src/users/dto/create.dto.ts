import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { SimpleDto } from './simple.dto';

export class CreateDto extends SimpleDto {
  @IsNotEmpty()
  @MinLength(10, {
    message:
      'password must have a minimum length of 12 characters. We highly recommend password managers.',
  })
  password: string;

  @IsNotEmpty()
  oneSignal_id: string;

  @IsNotEmpty()
  deviceId: string;
}
