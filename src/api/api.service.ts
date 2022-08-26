import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SymbolDTO } from './dto/symbol.dto';

@Injectable()
export class APIService {
  constructor(private readonly httpService: HttpService) {}

  async getPrices(symbolDto: SymbolDTO) {
    const _res = this.httpService.get(
      `https://finnhub.io/api/v1/crypto/candle?token=${process.env.FINNHUB_KEY}&resolution=D&symbol=BINANCE:${symbolDto.quote}${symbolDto.base}&from=${symbolDto.from}&to=${symbolDto.to}`,
    );
    const res = await firstValueFrom(_res);
    return res.data;
  }
}
