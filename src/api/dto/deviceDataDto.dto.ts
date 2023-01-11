import { IsNotEmpty } from 'class-validator';

export class DeviceDataDto {
  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  deviceName: string;

  userEmail: string;

  token: string;
}
