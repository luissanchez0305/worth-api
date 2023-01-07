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
import { SignalsService } from 'src/signals/signals.service';
import { WebsocketService } from './websocket.service';

@Controller('websocket')
export class WebsocketController {
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly signalService: SignalsService,
  ) {}

  @Get('start')
  async startWebsocket(@Request() params) {
    if (params.body.signalId) {
      const signalObj = await this.signalService.getSignal(
        params.body.signalId,
      );
      return await this.websocketService.startWebsocket(signalObj);
    } else {
      return { error: 'include signal' };
    }
  }
  @Get('stop')
  async stopWebsocket(@Request() params) {
    if (params.body.signalId) {
      const signalObj = await this.signalService.getSignal(
        params.body.signalId,
      );
      return await this.websocketService.stopWebsocket(
        signalObj.signal.id,
        signalObj.signal.exchangeSymbol,
      );
    } else {
      return { error: 'include symbol' };
    }
  }

  @Get('price/:symbol')
  async getSymbolPrice(@Param() params) {
    return await this.websocketService.getSymbolPrice(params.symbol);
  }
}
