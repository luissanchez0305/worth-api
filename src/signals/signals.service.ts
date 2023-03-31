import { Injectable } from '@nestjs/common';
import { Signal as signalModel } from './signals.model';
import { TakeProfit as takeProfitModel } from './takeProfit.model';
import { SignalLog as signalLogModel } from '../SignalLogs/signalLog.model';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedSignal, ToBoolean, Signal } from './types/index';
import { Repository } from 'typeorm';
import { UpdateDto } from './dto/update.dto';
import { convertToBoolean } from '../utils/convertToBoolean';
import { Signal as signalEntity, TakeProfit } from 'src/typeorm';
import { UpdateDtoTakeProfit } from './dto/update.takeProfit.dto';
import { getCurrentUTC } from 'src/utils/date';
import { SignalStatus } from 'src/typeorm/Signal';

@Injectable()
export class SignalsService {
  signals: Signal[] = [];

  constructor(
    @InjectRepository(signalModel)
    private readonly signalRepository: Repository<signalModel>,
    @InjectRepository(takeProfitModel)
    private readonly takeProfitRepository: Repository<takeProfitModel>,
    @InjectRepository(signalLogModel)
    private readonly signalLogsRepository: Repository<signalLogModel>,
  ) {}

  async getSignals() {
    const signals = await this.signalRepository
      .createQueryBuilder('signal')
      .leftJoinAndSelect('signal.takeProfits', 'take_profit')
      .getMany();
    return signals.map((signal) => new SerializedSignal(signal));
  }

  async createSignal(signalDto: CreateDto) {
    const newSignal = this.signalRepository.create(signalDto);
    const signalResponse = await this.signalRepository.save(newSignal);

    return signalResponse;
  }

  async getSignal(id: number) {
    const signal = await this.signalRepository.findOne({
      where: { id },
    });
    const profits = await this.takeProfitRepository
      .createQueryBuilder('takeProfit')
      .innerJoin('takeProfit.signal', 'tp_signal')
      .where('tp_signal.id = :id', { id })
      .getMany();
    const logs = await this.signalLogsRepository
      .createQueryBuilder('signalLog')
      .where('signalLog.signalId = :id', { id })
      .orderBy({
        created_at: 'DESC',
      })
      .getMany();

    signal.logs = logs;
    signal.takeProfits = profits;
    return { signal };
  }

  async updateEntryPriceReached(
    signalId: number,
    value: boolean,
    status: SignalStatus,
  ) {
    return await this.signalRepository
      .createQueryBuilder()
      .update(signalEntity)
      .set({
        entryPriceReached: value,
        entryPriceReachedDate: getCurrentUTC(),
        status,
      })
      .where('id = :id', { id: signalId })
      .execute();
  }

  async updateStopLostReached(
    signalId: number,
    value: boolean,
    status: SignalStatus,
  ) {
    return await this.signalRepository
      .createQueryBuilder()
      .update(signalEntity)
      .set({
        stopLostReached: value,
        stopLostReachedDate: getCurrentUTC(),
        status,
        closeReason: 'reached stop lost',
      })
      .where('id = :id', { id: signalId })
      .execute();
  }

  async updateSignal(signalDto: UpdateDto) {
    const signalId = signalDto.id;
    const signal = await this.signalRepository.findOne({
      where: { id: signalId },
    });
    if (!signal) {
      throw new Error('User does not exist');
    }
    signalDto.stopLostReached = convertToBoolean(signalDto.stopLostReached);
    const { ..._signalDto } = signalDto;
    return await this.signalRepository.save(_signalDto);
  }

  async updateTakeProfit(takeProfit: UpdateDtoTakeProfit) {
    return await this.takeProfitRepository.update(takeProfit.id, takeProfit);
  }
}
