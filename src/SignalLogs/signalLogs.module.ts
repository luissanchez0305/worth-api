import { Module } from '@nestjs/common';
import { SignalLogsService } from './signalLogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalLog } from 'src/typeorm';
import { SignalLogsController } from './signalLog.controrller';

@Module({
  imports: [TypeOrmModule.forFeature([SignalLog])],
  controllers: [SignalLogsController],
  providers: [SignalLogsService],
  exports: [SignalLogsService],
})
export class SignalLogsModule {}
