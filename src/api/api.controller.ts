import { Controller, Post, Body, Get, Request, Param } from '@nestjs/common';
import { SymbolDTO } from './dto/symbol.dto';
import { APIService } from './api.service';
import { DeviceDataDto } from './dto/deviceDataDto.dto';

@Controller('api')
export class APIController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly apiService: APIService) {}

  @Get('prices')
  async FinnhubPrices(@Body() symbolDto: SymbolDTO) {
    return this.apiService.getPrices(symbolDto);
  }

  @Get('symbols')
  async FinnhubSymbols() {
    const rest = this.apiService.getAllSymbols();
    return rest;
  }

  @Get('symbols/:from')
  async FinnhubSymbolsFromSearch(@Param() params) {
    return this.apiService.getSymbol(params.from.toLowerCase());
  }

  @Get('symbols/:from/:to')
  async FinnhubSymbolsSearch(@Param() params) {
    return this.apiService.getSymbol(
      params.from.toLowerCase(),
      params.to.toLowerCase(),
    );
  }
}
