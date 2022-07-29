import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { SignalsService } from './signals.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { SerializedSignal } from 'src/signals/types';

@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Get()
  findAll(): Promise<SerializedSignal[]> {
    return this.signalsService.getSignals();
  }

  @Get('signal')
  getUser(@Request() req) {
    return this.signalsService.getSignal(req.symbol);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() signalDto: CreateDto, @Request() res) {
    return this.signalsService.createSignal(signalDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  update(@Body() signalDto: UpdateDto, @Request() res): any {
    try {
      return this.signalsService.updateSignal(signalDto);
    } catch (ex) {
      return { error: ex };
    }
  }
}
