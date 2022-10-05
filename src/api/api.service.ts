import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, merge, zip } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
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

  async getAllSymbols() {
    const _resBinance = await this.httpService
      .get(
        `https://finnhub.io/api/v1/forex/symbol?token=${process.env.FINNHUB_KEY}&exchange=binance`,
      )
      .toPromise();
    const _resOanda = await this.httpService
      .get(
        `https://finnhub.io/api/v1/forex/symbol?token=${process.env.FINNHUB_KEY}&exchange=oanda`,
      )
      .toPromise();
    /* .pipe(
        map((res) => {
          return res.data;
        }),
      ); */
    const res = _resOanda.data.concat(_resBinance.data);
    return res;
  }

  async getSymbol(from = '', to = '') {
    const _resOanda = await this.httpService
      .get(
        `https://finnhub.io/api/v1/forex/symbol?token=${process.env.FINNHUB_KEY}&exchange=oanda`,
      )
      .toPromise();
    const _resBinance = await this.httpService
      .get(
        `https://finnhub.io/api/v1/forex/symbol?token=${process.env.FINNHUB_KEY}&exchange=binance`,
      )
      .toPromise();
    const res = _resOanda.data.concat(_resBinance.data);
    return res.filter(
      (item) =>
        item.symbol.toLowerCase().indexOf(`${from}${to}`) > -1 ||
        item.symbol.toLowerCase().indexOf(`${from}_${to}`) > -1,
    );
  }
}
