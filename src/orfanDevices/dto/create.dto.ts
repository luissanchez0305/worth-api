import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  oneSignal_id: string;
}
