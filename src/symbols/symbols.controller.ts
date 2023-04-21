import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  Param,
  ValidationPipe,
  Put,
  Delete,
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

  @Get(':id')
  getById(@Param() params) {
    return this.symbolsService.getSymbolId(params.id);
  }

  @Delete(':id')
  deleteSymbol(@Param() params): any {
    return this.symbolsService.deleteSymbol(params.id);
  }

  @Get('active')
  findAllActive(): Promise<SerializedSymbol[]> {
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

  @Delete()
  delete(@Body() symbolDto: UpdateDto): any {
    try {
      return this.symbolsService.deleteSymbol(symbolDto);
    } catch (ex) {
      return { error: ex };
    }
  }
}
