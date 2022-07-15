import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateDto } from './dto/create.dto';
import { SerializedCurrency } from './types/index';
import { UpdateDto } from './dto/update.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll(): Promise<SerializedCurrency[]> {
    return this.currenciesService.getCurrencies();
  }

  @Get('active')
  findAllActive(): Promise<SerializedCurrency[]> {
    return this.currenciesService.getAllActiveCurrencies();
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() currencyDto: CreateDto) {
    return this.currenciesService.createCurrency(currencyDto);
  }

  @Put()
  // @UsePipes(ValidationPipe)
  update(@Body() currencyDto: UpdateDto): any {
    try {
      return this.currenciesService.updateCurrency(currencyDto);
    } catch (ex) {
      return { error: ex };
    }
  }
}
