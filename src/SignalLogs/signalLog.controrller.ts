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
import { CreateDto } from './dto/create.dto';
import { SignalLogsService } from './signalLogs.service';
import { SerializedSignalLog } from './types';

@Controller('signal_logs')
export class SignalLogsController {
  constructor(private readonly signalLogsService: SignalLogsService) {}

  @Get()
  findAll(): Promise<SerializedSignalLog[]> {
    return this.signalLogsService.getSignalLogs();
  }

  @Get('signal/:id')
  findBySignal(@Param() params): Promise<SerializedSignalLog[]> {
    const { id } = params;
    return this.signalLogsService.getSignalLogsBySignal(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() signalLogDto: CreateDto) {
    return this.signalLogsService.createLog(signalLogDto);
  }
}
