import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  showMarquee: boolean;
}
