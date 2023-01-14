import { IsNotEmpty } from 'class-validator';
import { SimpleDto } from './simple.dto';

export class UpdateDeviceDto extends SimpleDto {
  @IsNotEmpty()
  oneSignal_id: string;

  @IsNotEmpty()
  deviceId: string;
}
