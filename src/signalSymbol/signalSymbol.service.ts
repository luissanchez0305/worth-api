import { Injectable } from '@nestjs/common';
import { SignalSymbols as signalSymbolsEntity } from './signalSymbol.model';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedCurrency } from './types/index';
import { Repository } from 'typeorm';

@Injectable()
export class SignalSymbolsService {
  constructor(
    @InjectRepository(signalSymbolsEntity)
    private readonly signalSymbolsRepository: Repository<signalSymbolsEntity>,
  ) {}

  async getCurrencies() {
    const symbols = await this.signalSymbolsRepository.find();
    return symbols.map((symbol) => new SerializedCurrency(symbol));
  }

  async getAllSymbols() {
    const symbols = await this.signalSymbolsRepository.find({
      order: {
        symbol: 'ASC',
      },
    });
    return symbols.map((symbol) => new SerializedCurrency(symbol));
  }

  async getSymbol(symbol: string) {
    const res = await this.signalSymbolsRepository.findOne({
      where: {
        symbol,
      },
    });
    return res;
  }

  /* async getAllActiveCurrencies() {
    const currencies = await this.currencyRepository.find({
      where: {
        isShown: true,
      },
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
    return currencies.map((currency) => new SerializedCurrency(currency));
  } */

  async createSymbol(symbolDto: CreateDto) {
    const symbol = await this.signalSymbolsRepository.findOne({
      where: { symbol: symbolDto.symbol },
    });
    if (symbol) {
      throw new Error('Currency already not exist');
    }
    const newSymbol = this.signalSymbolsRepository.create(symbolDto);
    return await this.signalSymbolsRepository.save(newSymbol);
  }

  async updateSymbol(symbolDto: CreateDto) {
    const currency = await this.signalSymbolsRepository.findOne({
      where: { symbol: symbolDto.symbol },
    });
    if (!currency) {
      throw new Error(`Currency does not exist: ${symbolDto.symbol}`);
    }
    return this.signalSymbolsRepository.update(currency.id, symbolDto);
  }
}
