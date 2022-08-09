import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ToBoolean } from '../types';
import { CreateDto } from './create.dto';

export class UpdateDto extends CreateDto {
  oneSignal_id: string;

  @IsNotEmpty()
  @ToBoolean()
  isPremium: boolean;
}
