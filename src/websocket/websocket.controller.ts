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
import { UsersService } from 'src/users/users.service';
import { randomCodeGenerator } from 'src/utils/randomCodeGenerator';
import { WebsocketService } from './websocket.service';

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly websocketService: WebsocketService) {}

  @Get('start')
  async startWebsocket(@Request() params) {
    console.log('start', params.body.symbol);
    return await this.websocketService.startWebsocket(params.body.symbol);
  }
  @Get('stop')
  async stopWebsocket(@Request() params) {
    console.log('stop', params.body.symbol);
    return await this.websocketService.stopWebsocket(params.body.symbol);
  }
}
