import { IsNotEmpty } from 'class-validator';
import { CreateDto } from './create.dto';

export class UpdateDto extends CreateDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  showMarquee: boolean;
}
