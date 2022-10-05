import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignalLog as signalLogEntity } from './signalLog.model';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class SignalLogsService {
  constructor(
    @InjectRepository(signalLogEntity)
    private readonly signalLogsRepository: Repository<signalLogEntity>,
  ) {}

  async createLog(signalLogDto: CreateDto) {
    const newlog = this.signalLogsRepository.create(signalLogDto);
    return await this.signalLogsRepository.save(newlog);
  }
}
