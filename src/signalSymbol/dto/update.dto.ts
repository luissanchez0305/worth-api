import { IsNotEmpty } from 'class-validator';
import { TakeProfit } from 'src/typeorm';
import { CreateDto } from './create.dto';

export class UpdateDto extends CreateDto {
  @IsNotEmpty()
  id: number;
}
