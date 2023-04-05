import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MailgunService } from 'nestjs-mailgun';
import { MailgunMessageData } from 'nestjs-mailgun';
import { SymbolDto } from './dto/symbol.dto';
import * as WebSocket from 'ws';
import { SignalSymbolsService } from 'src/signalSymbol/signalSymbol.service';
import { SignalsService } from 'src/signals/signals.service';
import { SignalLogsService } from 'src/SignalLogs/signalLogs.service';

@Injectable()
export class WebsocketService {
  ws: WebSocket = null;
  constructor(
    private readonly signalSymbolsService: SignalSymbolsService,
    private readonly signalsService: SignalsService,
    private readonly signalLogsService: SignalLogsService,
  ) {
    this.ws = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
    );
  }

  async startWebsocket(symbol: string) {
    this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));

    this.ws.on('message', function (event, isBinary) {
      const message = isBinary ? event : event.toString();

      console.log('Message from server ', message);
    });
  }

  async stopWebsocket(symbol: string) {
    console.log('stop', symbol);
    this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));
  }
}
