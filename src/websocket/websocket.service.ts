import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SymbolDto } from './dto/symbol.dto';
import { Signal } from 'src/signals/signals.model';
import { SignalSymbolsService } from 'src/signalSymbol/signalSymbol.service';
import { SignalsService } from 'src/signals/signals.service';
import { SignalLogsService } from 'src/SignalLogs/signalLogs.service';
import { WebSocket } from 'ws';

export class WebsocketService {
  ws: WebSocket = new WebSocket(
    // `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
    'wss://api.tiingo.com/crypto',
  );
  constructor(
    private readonly signalSymbolsService: SignalSymbolsService,
    private readonly signalsService: SignalsService,
    private readonly signalLogsService: SignalLogsService,
  ) {
    const subscribe = {
      eventName: 'subscribe',
      authorization: '74658269659330ee03fa822c23520b6b453325f2',
      eventData: {
        thresholdLevel: 5,
      },
    };

    this.ws.on('open', function open() {
      this.send(JSON.stringify(subscribe));
    });

    this.ws.on('message', function (event, isBinary) {
      const message = JSON.parse(event.toString());

      if (
        message.data &&
        message.data.length &&
        message.data[3] === 'binance' &&
        message.data[1] === 'btcbusd'
      ) {
        console.log('Message from server ', message.data, message.data[0]);
      }
    });
  }

  async startWebsocket(symbol: string) {
    // this.ws.on('subscribe', function (event, isBinary) {
    this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    // });

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
