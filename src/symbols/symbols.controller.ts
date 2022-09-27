import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { CreateDto } from './dto/create.dto';
import { SerializedSymbol } from './types/index';
import { UpdateDto } from './dto/update.dto';

@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @Get()
  findAll(): Promise<SerializedSymbol[]> {
    return this.symbolsService.getSymbols();
  }

  @Get('active')
  findAllActive(): Promise<SerializedSymbol[]> {
    console.log('active');
    return this.symbolsService.getAllActiveSymbols();
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() symbolDto: CreateDto) {
    return this.symbolsService.createSymbol(symbolDto);
  }

  @Put()
  // @UsePipes(ValidationPipe)
  update(@Body() symbolDto: UpdateDto): any {
    try {
      return this.symbolsService.updateSymbol(symbolDto);
    } catch (ex) {
      return { error: ex };
    }
  }
}
