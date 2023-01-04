import { IsNotEmpty } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  token: string;

  sound = 'default';

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;
}
