import { Controller, Post, Body, Get } from '@nestjs/common';
import { SymbolDTO } from './dto/symbol.dto';
import { APIService } from './api.service';

@Controller('api')
export class APIController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly apiService: APIService) {}

  @Get('prices')
  async FinnhubPrices(@Body() symbolDto: SymbolDTO) {
    return this.apiService.getPrices(symbolDto);
  }
}
