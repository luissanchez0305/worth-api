import { IsNotEmpty } from 'class-validator';
import { SignalStatus } from 'src/typeorm/Signal';
import { Signal } from '../signals.model';
import { CreateDto } from './create.dto';

export class UpdateDto extends CreateDto {
  @IsNotEmpty()
  id: number;

  status: SignalStatus;

  closeReason: string;

  constructor(item: Signal) {
    super();
    Object.assign(this, item);
  }
}
