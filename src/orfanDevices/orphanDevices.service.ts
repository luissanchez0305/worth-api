import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrphanDevice } from './orphanDevices.model';
import { UsersService } from 'src/users/users.service';
import { DeviceDataDto } from './dto/deviceDataDto.dto';

@Injectable()
export class OrphanDevicesService {
  constructor(
    @InjectRepository(OrphanDevice)
    private readonly orphanDeviceRepository: Repository<OrphanDevice>,
    private readonly usersService: UsersService,
  ) {}

  async getOrphanDeviceByDeviceId(deviceId: string) {
    const orphanDevice = await this.orphanDeviceRepository.findOne({
      where: { deviceId: deviceId },
    });
    return orphanDevice;
  }

  async create(orphanDevice: CreateDto) {
    const newOrphanDevice = this.orphanDeviceRepository.create(orphanDevice);
    await this.orphanDeviceRepository.save(newOrphanDevice);
    return newOrphanDevice;
  }

  async delete(orphanDeviceId: number) {
    const res = await this.orphanDeviceRepository.delete(orphanDeviceId);
    return res;
  }

  async sendDeviceData(deviceData: DeviceDataDto) {
    const user = await this.usersService.getUserByDeviceId(deviceData.deviceId);

    const orphanDevice = await this.orphanDeviceRepository.findOne({
      where: { deviceId: deviceData.deviceId },
    });

    if (!user && !orphanDevice) {
      const newOrphanDevice = this.orphanDeviceRepository.create({
        deviceId: deviceData.deviceId,
        oneSignal_id: deviceData.token,
      });

      await this.orphanDeviceRepository.save(newOrphanDevice);
    }
  }
}
