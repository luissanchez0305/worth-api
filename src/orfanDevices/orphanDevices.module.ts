import { Module } from '@nestjs/common';
import { OrphanDevicesController } from './orphanDevices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { OrphanDevice } from 'src/typeorm/OrphanDevice';
import { OrphanDevicesService } from './orphanDevices.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrphanDevice]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UsersModule,
  ],
  controllers: [OrphanDevicesController],
  providers: [OrphanDevicesService],
  exports: [OrphanDevicesService],
})
export class OrphanDeviceModule {}
