import { Module } from '@nestjs/common';
import { SignalLogsService } from './signalLogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalLog } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SignalLog])],
  providers: [SignalLogsService],
  exports: [SignalLogsService],
})
export class SignalLogsModule {}
