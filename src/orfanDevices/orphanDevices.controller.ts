import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Put,
  Request,
} from '@nestjs/common';
// import { ValidateUserDto } from './dto/email.dto';
import { OrphanDevicesService } from './orphanDevices.service';
import { CreateDto } from './dto/create.dto';
import { DeviceDataDto } from './dto/deviceDataDto.dto';
// import { NotificationDto } from './dto/notificationDto';

@Controller('orphan-device')
export class OrphanDevicesController {
  constructor(private readonly orphanDeviceService: OrphanDevicesService) {}

  @Post()
  async create(@Body() orphanDeviceDto: CreateDto) {
    return await this.orphanDeviceService.create(orphanDeviceDto);
  }

  @Put(':id')
  async delete(@Param('id') orphanDeviceId: string) {
    const orphanDevice =
      await this.orphanDeviceService.getOrphanDeviceByDeviceId(orphanDeviceId);
    if (orphanDevice) {
      return await this.orphanDeviceService.delete(Number(orphanDevice.id));
    }
  }

  @Patch('send-device-data')
  async sendDeviceData(@Body() deviceDataDto: DeviceDataDto) {
    return this.orphanDeviceService.sendDeviceData(deviceDataDto);
  }
}
