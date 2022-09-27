import { Injectable } from '@nestjs/common';
import { Signal as signalEntity } from './signals.model';
import { TakeProfit as takeProfitEntity } from './takeProfit.model';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedSignal, ToBoolean, Signal } from './types/index';
import { Repository } from 'typeorm';
import { UpdateDto } from './dto/update.dto';
import { convertToBoolean } from '../utils/convertToBoolean';
import { TakeProfit } from 'src/typeorm';

@Injectable()
export class SignalsService {
  signals: Signal[] = [];

  constructor(
    @InjectRepository(signalEntity)
    private readonly signalRepository: Repository<signalEntity>,
    @InjectRepository(takeProfitEntity)
    private readonly takeProfitRepository: Repository<takeProfitEntity>,
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

    return { signal, profits };
  }

  async updateSignal(signalDto: UpdateDto) {
    const signalId = signalDto.id;
    const profits = await this.takeProfitRepository
      .createQueryBuilder('takeProfit')
      .innerJoin('takeProfit.signal', 'tp_signal')
      .where('tp_signal.id = :signalId', { signalId })
      .getMany();
    const signal = await this.signalRepository.findOne({
      where: { id: signalId },
    });
    /* {
      where: { id: signalDto.id },
    }); */
    if (!signal) {
      throw new Error('User does not exist');
    }

    profits.forEach(async (p) => {
      await this.takeProfitRepository.remove(p);
    });

    if (signalDto.takeProfits) {
      signalDto.takeProfits.forEach(async (tp) => {
        const { price } = tp;
        const _tp = new TakeProfit();
        _tp.price = price;
        _tp.signal = signal;
        await this.takeProfitRepository.save(_tp);
      });
    }
    signalDto.stopLostReached = convertToBoolean(signalDto.stopLostReached);
    const { takeProfits, ..._signalDto } = signalDto;
    return await this.signalRepository.update(signal.id, _signalDto);
  }
}
