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
  private ws = new WebSocket(
    `wss://ws.finnhub.io?token=${process.env.FINNHUB_KEY}`,
  );

  async startWebsocket(signalObj: { signal: Signal; profits: TakeProfit[] }) {
    let previousPrice: Decimal;
    const { signal, profits } = signalObj;

    this.signalLogsService.createLog(
      new CreateDto(signal, 'signal has started'),
    );

    const checkProfits = profits
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
    let checkProfit = checkProfits[0];

    console.log('signal', signalObj);
    this.ws.send(
      JSON.stringify({
        type: 'subscribe',
        symbol: signalObj.signal.exchangeSymbol,
      }),
      (obj) => {
        console.log('response', obj);
      },
    );

    const signalSymbolsS = this.signalSymbolsService;
    let signalSymbol = await this.signalSymbolsService.getSymbol(
      signalObj.signal.exchangeSymbol,
    );

    if (!signalSymbol) {
      signalSymbol = await this.signalSymbolsService.createSymbol({
        symbol: signalObj.signal.exchangeSymbol,
        price: 0,
      });
    }

    this.ws
      .on('open', (event, isBinary) => {
        const open = isBinary ? event : event.toString();
        const _data = JSON.parse(open.toString()).data;
        console.log('websocket open', _data);
      })
      .on('message', (event, isBinary) => {
        const message = isBinary ? event : event.toString();
        // search for symbol is exists update the price
        // if doesn't exist create the signal symbol
        const _data = JSON.parse(message.toString()).data;
        if (_data) {
          const data = _data[_data.length - 1];
          const date = new Date(data.t);
          const price = new Decimal(data.p);

          // CHECK FOR STOP LOST
          if (
            ((signal.type === 'BUY' &&
              signal.stopLost > price &&
              previousPrice > signal.stopLost) ||
              (signal.type === 'SELL' &&
                signal.stopLost < price &&
                previousPrice < signal.stopLost)) &&
            !signal.stopLostReached
          ) {
            // modifica signal stop lost
            signal.stopLostReached = true;
            signal.stopLostReachedDate = getCurrentUTC();
            signal.status = SignalStatus.Deactivated;
            signal.closeReason = 'reached stop lost';
            const signalUpdate = new UpdateDto(signal);
            signalUpdate.takeProfits = profits;

            this.signalLogsService.createLog(
              new CreateDto(signal, 'it have reach stop lost. closing signal'),
            );

            console.log(
              'take profits en signalUpdate',
              signalUpdate.takeProfits,
            );
            this.signalsService.updateSignal(signalUpdate);
            // TODO enviar notificacion
            console.log(
              '----------- envia notificacion stop lost',
              signal.stopLost,
              price,
            );
            this.stopWebsocket(signal.exchangeSymbol);
          }
          // CHECK FOR ENTRY PRICE
          else if (
            ((signal.type === 'BUY' &&
              signal.entryPrice > price &&
              previousPrice > signal.entryPrice) ||
              (signal.type === 'SELL' &&
                signal.entryPrice < price &&
                previousPrice < signal.entryPrice)) &&
            !signal.entryPriceReached
          ) {
            // modifica signal entry price
            signal.entryPriceReached = true;
            signal.entryPriceReachedDate = getCurrentUTC();
            signal.status = SignalStatus.EntryPriceReached;
            const signalUpdate = new UpdateDto(signal);
            signalUpdate.takeProfits = profits;
            console.log(
              'take profits en signalUpdate',
              signalUpdate.takeProfits,
            );
            this.signalsService.updateSignal(signalUpdate);

            this.signalLogsService.createLog(
              new CreateDto(signal, 'it have reach entry price'),
            );

            console.log(
              `------------ envia notificacion entry price ${signal.entryPrice}`,
              signal.entryPrice,
              price,
            );
          }
          // CHECK FOR TAKE PROFIT
          else if (
            ((signal.type === 'BUY' &&
              checkProfit.price < price &&
              previousPrice < checkProfit.price) ||
              (signal.type === 'SELL' &&
                checkProfit.price > price &&
                previousPrice > checkProfit.price)) &&
            !checkProfit.takeProfitReached &&
            signal.entryPriceReached
          ) {
            this.signalLogsService.createLog(
              new CreateDto(
                signal,
                `it have reach take profit ${checkProfit.price}`,
              ),
            );

            checkProfit.takeProfitReached = true;
            checkProfit.takeProfitReachedDate = getCurrentUTC();
            const _takeProfit = new UpdateDtoTakeProfit(checkProfit);
            console.log('take profit alcanzado', _takeProfit);
            this.signalsService.updateTakeProfit(_takeProfit);

            const checkProfits = profits
              .sort((a: TakeProfit, b: TakeProfit) =>
                (signal.type === 'BUY' ? a.price < b.price : a.price > b.price)
                  ? -1
                  : 1,
              )
              .filter((tp) => !tp.takeProfitReached);

            // si ya no hay take profits cerrar la señal
            if (!checkProfits.length) {
              signal.status = SignalStatus.Deactivated;
              signal.closeReason = 'no more take profits';
              const signalUpdate = new UpdateDto(signal);
              signalUpdate.takeProfits = profits;
              this.signalsService.updateSignal(signalUpdate);
              this.stopWebsocket(signal.exchangeSymbol);

              this.signalLogsService.createLog(
                new CreateDto(signal, `no more take profit. closing signal`),
              );
            } else {
              checkProfit = checkProfits[0];

              // TODO enviar notificacion
              console.log(
                `--------- envia notificacion take profit`,
                checkProfit.price,
                price,
              );
            }
          }

          if (date.getUTCSeconds() % 5 === 0) {
            signalSymbolsS.updateSymbol({
              id: signalSymbol.id,
              symbol: signal.exchangeSymbol,
              price: data.p,
            });
          }
          previousPrice = price;
        }
      })
      .on('error', (event) => {
        console.log('websocket error', event);
      })
      .on('close', (event) => {
        console.log('websocket close', event);
      });
  }

  async stopWebsocket(symbol: string) {
    console.log('stop', symbol);
    this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));
  }
}
