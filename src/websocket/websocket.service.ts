import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MailgunService } from 'nestjs-mailgun';
import { MailgunMessageData } from 'nestjs-mailgun';
import { SymbolDto } from './dto/symbol.dto';
import * as WebSocket from 'ws';

@Injectable()
export class WebsocketService {
  private ws = new WebSocket(
    `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
  );

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
