import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignalLog as signalLogEntity } from './signalLog.model';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { SerializedSignalLog } from './types';

@Injectable()
export class SignalLogsService {
  constructor(
    @InjectRepository(signalLogEntity)
    private readonly signalLogsRepository: Repository<signalLogEntity>,
  ) {}

  async getSignalLogs() {
    const signalLogs = await this.signalLogsRepository.find({
      order: {
        created_at: 'ASC',
        id: 'DESC',
      },
    });
    return signalLogs.map((signalLog) => new SerializedSignalLog(signalLog));
  }

  async getSignalLogsBySignal(id: number) {
    const signalLogs = await this.signalLogsRepository
      .createQueryBuilder('signalLog')
      .where('signalLog.signalId = :id', { id })
      .orderBy({
        created_at: 'DESC',
      })
      .getMany();
    return signalLogs.map((signalLog) => new SerializedSignalLog(signalLog));
  }

  async createLog(signalLogDto: CreateDto) {
    const newSignalLog = this.signalLogsRepository.create(signalLogDto);
    const signalLogResponse = await this.signalLogsRepository.save(
      newSignalLog,
    );

    return signalLogResponse;
  }
}
