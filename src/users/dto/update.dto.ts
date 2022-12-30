import { IsNotEmpty } from 'class-validator';
import { ToBoolean } from '../types';
import { SimpleDto } from './simple.dto';

export class UpdateDto extends SimpleDto {
  oneSignal_id: string;

  @IsNotEmpty()
  @ToBoolean()
  isPremium: boolean;
}
