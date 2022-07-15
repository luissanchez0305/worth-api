import { IsNotEmpty } from 'class-validator';
import { CreateDto } from './create.dto';

export class UpdateDto extends CreateDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  isShown: boolean;
}
