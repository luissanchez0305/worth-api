import { Injectable } from '@nestjs/common';
import { Currency as currencyEntity } from './currencies.model';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedCurrency, Currency as currencyType } from './types/index';
import { Repository } from 'typeorm';
import { UpdateDto } from './dto/update.dto';
import { convertToBoolean } from 'src/utils/convertToBoolean';

@Injectable()
export class CurrenciesService {
  currencies: currencyType[] = [];

  constructor(
    @InjectRepository(currencyEntity)
    private readonly currencyRepository: Repository<currencyEntity>,
  ) {}

  async getCurrencies() {
    const currencies = await this.currencyRepository.find({
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
    return currencies.map((currency) => new SerializedCurrency(currency));
  }

  async getAllActiveCurrencies() {
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
  }

  async createCurrency(currencyDto: CreateDto) {
    const currency = await this.currencyRepository.findOne({
      where: { name: currencyDto.name },
    });
    if (currency) {
      throw new Error('Currency already not exist');
    }
    const newCurrency = this.currencyRepository.create(currencyDto);
    currencyDto.isShown = convertToBoolean(currencyDto.isShown);
    return await this.currencyRepository.save(newCurrency);
  }

  async updateCurrency(currencyDto: UpdateDto) {
    const currency = await this.currencyRepository.findOne({
      where: { id: currencyDto.id },
    });
    if (!currency) {
      throw new Error('Currency does not exist');
    }
    currencyDto.isShown = convertToBoolean(currencyDto.isShown);
    return this.currencyRepository.update(currency.id, currencyDto);
  }
}
