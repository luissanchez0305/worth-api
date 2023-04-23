import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SymbolDto } from './dto/symbol.dto';
import { Signal } from 'src/signals/signals.model';
import { SignalSymbolsService } from 'src/signalSymbol/signalSymbol.service';
import { SignalsService } from 'src/signals/signals.service';
import { SignalLogsService } from 'src/SignalLogs/signalLogs.service';
import { WebSocket } from 'ws';
import { SymbolData } from './types';
import { APIService } from 'src/api/api.service';

@Injectable()
export class WebsocketService implements OnModuleInit {
  private ws = new WebSocket(
    // `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
    'wss://api.tiingo.com/crypto',
  );
  private symbols: SymbolData[] = [];
  private minuteRan = 0;
  constructor(
    private readonly signalSymbolsService: SignalSymbolsService,
    private readonly signalsService: SignalsService,
    private readonly signalLogsService: SignalLogsService,
    private readonly apiService: APIService,
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

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.ws.on('message', function (event, isBinary) {
      const message = JSON.parse(event.toString());
      const cryptoList = self.symbols.filter(
        (s) => s.symbol.indexOf('BINANCE') > -1,
      );
      const forexList = self.symbols.filter(
        (s) => s.symbol.indexOf('OANDA') > -1,
      );
      if (message.data && message.data.length) {
        if (
          message.data[3] === 'binance' &&
          cryptoList.find(
            (s) => s.symbol.toLowerCase().indexOf(message.data[1]) > -1,
          )
        ) {
          console.log(
            'Message from server crypto',
            message.data,
            message.data[0],
          );
        }
        const date = new Date();
        // runs every 2 minutes
        if (
          self.minuteRan !== date.getUTCMinutes() &&
          date.getUTCMinutes() % 2 === 0
        ) {
          self.getAllSignalSymbols();
          const forexSymbols = [];
          for (const forex of forexList) {
            forexSymbols.push(
              forex.symbol.replace('OANDA:', '').replace('_', '').toLowerCase(),
            );
            console.log('forex', forex.symbol);
          }
          self.apiService
            .getTiingoForexPrices(forexSymbols.join(','))
            .then((data) => {
              console.log('data', data);
            });
          self.minuteRan = date.getUTCMinutes();
        }
      }
    });
  }

  onModuleInit() {
    this.getAllSignalSymbols();
  }

  async getAllSignalSymbols() {
    this.symbols = [];
    if (this.signalsService && !this.symbols.length) {
      const _symbols = await this.signalsService.getSignals();
      for (const symbol of _symbols) {
        this.symbols.push({
          symbol: symbol.exchangeSymbol,
        });
      }
    }
  }

  async stopWebsocket(symbol: string) {
    console.log('stop', symbol);
    // this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));
  }
}
