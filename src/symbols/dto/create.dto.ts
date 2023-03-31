import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  from: string;

  to: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  showMarquee: boolean;
}
