import { Injectable } from '@nestjs/common';
import { Symbol as symbolEntity } from './symbols.model';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedSymbol } from './types/index';
import { Repository } from 'typeorm';
import { UpdateDto } from './dto/update.dto';
import { convertToBoolean } from 'src/utils/convertToBoolean';

@Injectable()
export class SymbolsService {
  constructor(
    @InjectRepository(symbolEntity)
    private readonly symbolRepository: Repository<symbolEntity>,
  ) {}

  async getSymbols() {
    const symbols = await this.symbolRepository.find({
      order: {
        type: 'ASC',
        id: 'DESC',
      },
    });
    return symbols.map((symbol) => new SerializedSymbol(symbol));
  }

  async getAllActiveSymbols() {
    const symbols = await this.symbolRepository.find({
      where: {
        showMarquee: true,
      },
      order: {
        type: 'ASC',
        id: 'DESC',
      },
    });
    return symbols.map((symbol) => new SerializedSymbol(symbol));
  }

  async createSymbol(symbolDto: CreateDto) {
    const symbol = await this.symbolRepository.findOne({
      where: { from: symbolDto.from, to: symbolDto.to },
    });
    if (symbol) {
      throw new Error('Symbol already not exist');
    }
    const newSymbol = this.symbolRepository.create(symbolDto);
    symbolDto.showMarquee = convertToBoolean(symbolDto.showMarquee);
    return await this.symbolRepository.save(newSymbol);
  }

  async updateSymbol(symbolDto: UpdateDto) {
    const symbol = await this.symbolRepository.findOne({
      where: { id: symbolDto.id },
    });
    if (!symbol) {
      throw new Error('Symbol does not exist');
    }
    symbolDto.showMarquee = convertToBoolean(symbolDto.showMarquee);
    return this.symbolRepository.update(symbol.id, symbolDto);
  }

  deleteSymbol(id: number): any {
    return this.symbolRepository.delete(id);
  }

  async getSymbolId(id: number) {
    const user = await this.symbolRepository.findOne({
      where: { id },
    });
  
    return user;
  }
}
