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
import { SymbolData } from './types';
import { Signal } from 'src/signals/signals.model';
import { TakeProfit } from 'src/signals/takeProfit.model';
import { SignalsService } from 'src/signals/signals.service';
import { UpdateDto } from 'src/signals/dto/update.dto';
import { UpdateDtoTakeProfit } from 'src/signals/dto/update.takeProfit.dto';
import { getCurrentUTC } from 'src/utils/date';
import { SignalStatus } from 'src/typeorm/Signal';
import { SignalLogsService } from 'src/SignalLogs/signalLogs.service';
import { CreateDto } from 'src/SignalLogs/dto/create.dto';

@Injectable()
export class WebsocketService {
  constructor(
    private readonly signalSymbolsService: SignalSymbolsService,
    private readonly signalsService: SignalsService,
    private readonly signalLogsService: SignalLogsService,
  ) {}
  private symbols: SymbolData[] = [];
  public websockets: { id: number; ws: WebSocket }[] = [];

  async startWebsocket(signalObj: { signal: Signal }) {
    const localWS = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
    );

    const { signal } = signalObj;
    localWS.onopen = () => {
      const checkProfits = signal.takeProfits
        .sort((a: TakeProfit, b: TakeProfit) =>
          (signal.type === 'BUY' ? a.price < b.price : a.price > b.price)
            ? -1
            : 1,
        )
        .filter((tp) => !tp.takeProfitReached);
      if (!checkProfits.length) {
        console.log('Error no "take profit" found');
        return;
      }
      const checkProfit = checkProfits[0];

      console.log(
        'ws',
        this.websockets.map((w) => {
          return { id: w.id, state: w.ws.readyState };
        }),
      );
      localWS.send(
        JSON.stringify({
          type: 'subscribe',
          symbol: signalObj.signal.exchangeSymbol,
        }),
        () => {
          this.symbols.push({
            symbol: signalObj.signal.exchangeSymbol,
            signal: signalObj.signal,
            checkProfit,
            takeProfits: signal.takeProfits,
            previousPrice: new Decimal(0),
          });
          this.signalLogsService.createLog(
            new CreateDto(signal, 'signal has started'),
          );
        },
      );

      /* localWS
        .on('open', (event, isBinary) => {
          const open = isBinary ? event : event.toString();
          const _data = JSON.parse(open.toString()).data;
          console.log('websocket open', _data);
        })
        */
    };

    const signalSymbolsS = this.signalSymbolsService;
    this.signalSymbolsService
      .getSymbol(signalObj.signal.exchangeSymbol)
      .then(async (signalSymbol) => {
        if (!signalSymbol) {
          signalSymbol = await this.signalSymbolsService.createSymbol({
            symbol: signalObj.signal.exchangeSymbol,
            price: 0,
          });
        }
      });

    localWS.onerror = (event) => {
      console.log('websocket error', event);
    };

    localWS.onclose = (event) => {
      console.log('websocket close', event, new Date());
    };

    localWS.onmessage = (event) => {
      // search for symbol is exists update the price
      // if doesn't exist create the signal symbol
      const _data = JSON.parse(event.data.toString()).data;
      if (_data) {
        const data = _data[_data.length - 1];

        const { date = new Date(data.t), price = new Decimal(data.p) } = data;

        const symbol = this.symbols.find((item) => item.symbol == data.s);
        if (symbol) {
          // CHECK FOR STOP LOST
          if (
            ((symbol.signal.type === 'BUY' &&
              symbol.signal.stopLost > price &&
              symbol.previousPrice > symbol.signal.stopLost) ||
              (symbol.signal.type === 'SELL' &&
                symbol.signal.stopLost < price &&
                symbol.previousPrice < symbol.signal.stopLost)) &&
            !symbol.signal.stopLostReached
          ) {
            // modifica signal stop lost
            this.signalsService.updateStopLostReached(
              symbol.signal.id,
              true,
              SignalStatus.Deactivated,
            );

            this.signalLogsService.createLog(
              new CreateDto(signal, 'it have reach stop lost. closing signal'),
            );

            symbol.signal.stopLostReached = true;
            symbol.signal.status = SignalStatus.Deactivated;

            // TODO enviar notificacion
            console.log(
              '----------- envia notificacion stop lost',
              signal.stopLost,
              price,
            );
            this.stopWebsocket(symbol.signal.id, symbol.signal.exchangeSymbol);
          }
          // CHECK FOR ENTRY PRICE
          else if (
            ((symbol.signal.type === 'BUY' &&
              symbol.signal.entryPrice > price &&
              symbol.previousPrice > symbol.signal.entryPrice) ||
              (symbol.signal.type === 'SELL' &&
                symbol.signal.entryPrice < price &&
                symbol.previousPrice < symbol.signal.entryPrice)) &&
            !symbol.signal.entryPriceReached
          ) {
            // modifica signal entry price
            this.signalsService.updateEntryPriceReached(
              symbol.signal.id,
              true,
              SignalStatus.EntryPriceReached,
            );

            this.signalLogsService.createLog(
              new CreateDto(signal, 'it have reach entry price'),
            );

            symbol.signal.entryPriceReached = true;
            symbol.signal.status = SignalStatus.EntryPriceReached;

            console.log(
              `------------ envia notificacion entry price ${signal.entryPrice}`,
              data.s,
              price,
            );
          }
          // CHECK FOR TAKE PROFIT
          else if (
            ((symbol.signal.type === 'BUY' &&
              symbol.checkProfit.price < price &&
              symbol.previousPrice < symbol.checkProfit.price) ||
              (symbol.signal.type === 'SELL' &&
                symbol.checkProfit.price > price &&
                symbol.previousPrice > symbol.checkProfit.price)) &&
            !symbol.checkProfit.takeProfitReached &&
            symbol.signal.entryPriceReached
          ) {
            this.signalLogsService.createLog(
              new CreateDto(
                symbol.signal,
                `it have reach take profit ${symbol.checkProfit.price}`,
              ),
            );

            symbol.checkProfit.takeProfitReached = true;
            symbol.checkProfit.takeProfitReachedDate = getCurrentUTC();
            const _takeProfit = new UpdateDtoTakeProfit(symbol.checkProfit);
            console.log('take profit alcanzado', _takeProfit);
            this.signalsService.updateTakeProfit(_takeProfit);

            const checkProfits = symbol.takeProfits
              .sort((a: TakeProfit, b: TakeProfit) =>
                (signal.type === 'BUY' ? a.price < b.price : a.price > b.price)
                  ? -1
                  : 1,
              )
              .filter((tp) => !tp.takeProfitReached);

            // si ya no hay take profits cerrar la señal
            if (!checkProfits.length) {
              symbol.signal.status = SignalStatus.Deactivated;
              symbol.signal.closeReason = 'no more take profits';
              const signalUpdate = new UpdateDto(symbol.signal);
              signalUpdate.takeProfits = symbol.takeProfits;
              this.signalsService.updateSignal(signalUpdate);
              this.stopWebsocket(signal.id, signal.exchangeSymbol);

              this.signalLogsService.createLog(
                new CreateDto(signal, `no more take profit. closing signal`),
              );
            } else {
              symbol.checkProfit = checkProfits[0];

              // TODO enviar notificacion
              console.log(
                `--------- envia notificacion take profit`,
                symbol.checkProfit.price,
                price,
              );
            }
          }

          if (date.getUTCSeconds() % 2 === 0) {
            signalSymbolsS.updateSymbol({
              symbol: data.s,
              price: data.p,
            });
          }
          symbol.previousPrice = price;
        }
      }
    };

    this.websockets.push({ id: signal.id, ws: localWS });
  }

  async stopWebsocket(wsId: number, symbol: string) {
    console.log('stop', symbol);
    const websocket = this.websockets.find((w) => w.id === wsId);

    websocket.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));

    this.websockets = this.websockets.filter((w) => w.id !== wsId);
    this.symbols = this.symbols.filter((s) => s.symbol !== symbol);

    console.log(
      'ws',
      this.websockets.map((w) => {
        return { id: w.id, state: w.ws.readyState };
      }),
    );
  }

  async getSymbolPrice(symbol: string): Promise<Decimal> {
    const _symbol = await this.signalSymbolsService.getSymbol(symbol);

    return _symbol.price;
  }
}
