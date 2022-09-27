import { Injectable } from '@nestjs/common';
import { SignalSymbols as signalSymbolsEntity } from '../signalSymbol/signalSymbol.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MailgunService } from 'nestjs-mailgun';
import { MailgunMessageData } from 'nestjs-mailgun';
import { SymbolDto } from './dto/symbol.dto';
import * as WebSocket from 'ws';
import { SignalSymbolsService } from 'src/signalSymbol/signalSymbol.service';
import Decimal from 'decimal.js';

@Injectable()
export class WebsocketService {
  constructor(private readonly signalSymbolsService: SignalSymbolsService) {}
  private ws = new WebSocket(
    `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
  );

  async startWebsocket(symbol: string) {
    this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    const signalSymbolsS = this.signalSymbolsService;
    let signalSymbol = await this.signalSymbolsService.getSymbol(symbol);
    if (!signalSymbol) {
      signalSymbol = await this.signalSymbolsService.createSymbol({
        symbol,
        price: 20300.03,
      });
    }
    this.ws.on('message', function (event, isBinary) {
      const message = isBinary ? event : event.toString();
      // search for symbol is exists update the price
      // if doesn't exist create the signal symbol
      const _data = JSON.parse(message.toString()).data;
      if (_data) {
        const data = _data[_data.length - 1];
        const date = new Date(data.t);
        if (date.getUTCSeconds() % 30 === 0) {
          console.log(`Message from server ${symbol}`, data.p);
          signalSymbolsS.updateSymbol({
            id: signalSymbol.id,
            symbol,
            price: data.p,
          });
        }
      }
    });
  }

  async stopWebsocket(symbol: string) {
    console.log('stop', symbol);
    this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));
  }
}
