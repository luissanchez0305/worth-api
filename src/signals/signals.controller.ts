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

  @Get(':id')
  getSignal(@Param() params) {
    return this.signalsService.getSignal(params.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() signalDto: CreateDto) {
    return this.signalsService.createSignal(signalDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  update(@Body() signalDto: UpdateDto): any {
    try {
      return this.signalsService.updateSignal(signalDto);
    } catch (ex) {
      return { error: ex };
    }
  }
}
