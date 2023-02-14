import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SymbolDto } from './dto/symbol.dto';
import { Signal } from 'src/signals/signals.model';
import { SignalSymbolsService } from 'src/signalSymbol/signalSymbol.service';
import { SignalsService } from 'src/signals/signals.service';
import { SignalLogsService } from 'src/SignalLogs/signalLogs.service';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io'
@WebSocketGateway()
export class WebsocketService {
  constructor(
    private readonly signalSymbolsService: SignalSymbolsService,
    private readonly signalsService: SignalsService,
    private readonly signalLogsService: SignalLogsService,
  ) {

  }

  server: Server;

  @SubscribeMessage('newSignal')
  onNewSignal(@MessageBody() signalObj: { signal: Signal }){
    console.log("🚀 ~ file: websocket.service.ts:23 ~ WebsocketService ~ onNewSignal ~ signal", signalObj)
  }


  // ws: WebSocket = null;
  // constructor(
  //   private readonly signalSymbolsService: SignalSymbolsService,
  //   private readonly signalsService: SignalsService,
  //   private readonly signalLogsService: SignalLogsService,
  // ) {
  //   // this.ws = new WebSocket(
  //   //   `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
  //   // );
  // }

  // async startWebsocket(symbol: string) {
  //   this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));

  //   this.ws.on('message', function (event, isBinary) {
  //     const message = isBinary ? event : event.toString();

  //     console.log('Message from server ', message);
  //   });
  // }

  // async stopWebsocket(symbol: string) {
  //   console.log('stop', symbol);
  //   this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));
  // }
}
