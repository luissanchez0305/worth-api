import { Injectable, OnModuleInit } from '@nestjs/common';
import { SignalSymbolsService } from 'src/signalSymbol/signalSymbol.service';
import { SignalsService } from 'src/signals/signals.service';
import { SignalLogsService } from 'src/SignalLogs/signalLogs.service';
import { WebSocket } from 'ws';
import { SymbolData } from './types';
import { APIService } from 'src/api/api.service';
import Decimal from 'decimal.js';
import { getPriceWithCorrectDecimals } from 'src/utils/decimalNumbers';
import { UpdateDto } from 'src/signals/dto/update.dto';

@Injectable()
export class WebsocketService implements OnModuleInit {
  private wsCrypto = new WebSocket(
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
  ) {}

  async checkPrice(_this: any, currentPrice: number, foundSignal: SymbolData) {
    const signalSymbol = await _this.signalSymbolsService.getSymbol(
      foundSignal.symbol,
    );

    console.log('signalSymbol', currentPrice, foundSignal.stopLost);
    // --------------- CHECK FOR STOP LOST ----------------------
    if (
      signalSymbol &&
      foundSignal.type === 'SELL' &&
      !foundSignal.stopLostReached &&
      _this.didPriceWentUp(
        Number(signalSymbol.price),
        currentPrice,
        Number(foundSignal.stopLost),
      )
    ) {
      // TODO: send notification

      // update signal SELL
      //    x stop lost reached
      //    x entry price reached
      foundSignal.stopLostReached = true;
      updateSignal(_this, foundSignal, true, true);
    } else if (
      signalSymbol &&
      foundSignal.type === 'BUY' &&
      !foundSignal.stopLostReached &&
      _this.didPriceWentDown(
        Number(signalSymbol.price),
        currentPrice,
        Number(foundSignal.stopLost),
      )
    ) {
      // TODO: send notification
      // update signal BUY
      //    stop lost reached
      //    entry price reached
      foundSignal.stopLostReached = true;
      updateSignal(_this, foundSignal, true, true);
    }
    // --------------- CHECK FOR ENTRY PRICE ----------------------
    else if (
      signalSymbol &&
      foundSignal.type === 'SELL' &&
      !foundSignal.entryPriceReached &&
      _this.didPriceWentUp(
        Number(signalSymbol.price),
        currentPrice,
        Number(foundSignal.entryPrice),
      )
    ) {
      // TODO: send notification
      // update signal SELL
      //    entry price reached
      foundSignal.entryPriceReached = true;
      updateSignal(_this, foundSignal, false, true);
    } else if (
      signalSymbol &&
      foundSignal.type === 'BUY' &&
      !foundSignal.entryPriceReached &&
      _this.didPriceWentDown(
        Number(signalSymbol.price),
        currentPrice,
        Number(foundSignal.entryPrice),
      )
    ) {
      // TODO: send notification
      // update signal BUY
      //    entry price reached
      foundSignal.entryPriceReached = true;
      updateSignal(_this, foundSignal, false, true);
    }

    // --------------- CHECK FOR TAKE PROFIT ----------------------
    if (foundSignal.type === 'SELL') {
      const sortedTPs = foundSignal.takeProfits.sort(
        (a, b) => Number(b.price) - Number(a.price),
      );
      const reachedTP = [];
      for (const tp of sortedTPs) {
        if (
          signalSymbol &&
          !tp.takeProfitReached &&
          _this.didPriceWentDown(
            Number(signalSymbol.price),
            currentPrice,
            Number(tp.price),
          )
        ) {
          foundSignal.takeProfits[
            foundSignal.takeProfits.map((_tp) => _tp.id).indexOf(tp.id)
          ].takeProfitReached = true;
          reachedTP.push(tp.id);
        }
      }
      if (reachedTP.length > 0) {
        // TODO: send notification

        // update take profit
        //    take profit reached
        foundSignal.takeProfits = foundSignal.takeProfits.filter(
          (tp) => reachedTP.indexOf(tp.id) > -1,
        );
        updateSignal(_this, foundSignal, false, false, true);
      }
    } else if (foundSignal.type === 'BUY') {
      const sortedTPs = foundSignal.takeProfits.sort(
        (a, b) => Number(a.price) - Number(b.price),
      );
      const reachedTP = [];
      for (const tp of sortedTPs) {
        if (
          signalSymbol &&
          !tp.takeProfitReached &&
          _this.didPriceWentUp(
            Number(signalSymbol.price),
            currentPrice,
            Number(tp.price),
          )
        ) {
          foundSignal.takeProfits[
            foundSignal.takeProfits.map((_tp) => _tp.id).indexOf(tp.id)
          ].takeProfitReached = true;
          reachedTP.push(tp.id);
        }
      }
      if (reachedTP.length > 0) {
        // TODO: send notification

        // update take profit
        //    take profit reached
        foundSignal.takeProfits = foundSignal.takeProfits.filter(
          (tp) => reachedTP.indexOf(tp.id) > -1,
        );
        updateSignal(_this, foundSignal, false, false, true);
      }
    }
  }

  didPriceWentUp(
    previousPrice: number,
    currentPrice: number,
    monitorPrice: number,
  ): boolean {
    return currentPrice > monitorPrice /* && previousPrice < monitorPrice */;
  }

  didPriceWentDown(
    previousPrice: number,
    currentPrice: number,
    monitorPrice: number,
  ): boolean {
    return currentPrice < monitorPrice /* && previousPrice > monitorPrice */;
  }

  onModuleInit() {
    this.getAllSignalSymbols().then((symbols) => {
      const subscribe = {
        eventName: 'subscribe',
        authorization: process.env.TIINGO_KEY,
        subscriptionId: 'crypto_1',
        eventData: {
          thresholdLevel: 5,
          tickers: symbols.map((s) => s.symbol.replace('BINANCE:', '')),
          // subscriptionId: 'crypto_1',
        },
      };

      console.log('websocket subscribe');
      this.wsCrypto.on('open', function open() {
        this.send(JSON.stringify(subscribe));
      });

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      this.wsCrypto.on('message', function (event, isBinary) {
        try {
          const message = JSON.parse(event.toString());

          // console.log('websocket message', message);
          const cryptoList = self.symbols.filter(
            (s) => s.symbol.indexOf('BINANCE') > -1,
          );

          const forexList = self.symbols.filter(
            (s) => s.symbol.indexOf('OANDA') > -1,
          );

          if (message.data && message.data.length) {
            const date = new Date();

            const foundCrypto = cryptoList.find(
              (s) => s.symbol.toLowerCase().indexOf(message.data[1]) > -1,
            );

            if (message.data[3] === 'binance' && foundCrypto) {
              // TODO hacer metodo para comparar precio actual con el anterior y segun el tipo
              self.symbols[foundCrypto.index].previousPrice = message.data[5];

              self.checkPrice(self, message.data[5], foundCrypto);
              try {
                self.signalSymbolsService.updateSymbol({
                  symbol: foundCrypto.symbol,
                  price: getPriceWithCorrectDecimals(message.data[5]),
                });
              } catch (e) {
                console.log('updateSymbol error ', e);
              }
            }

            // runs every 2 minutes
            if (
              self.minuteRan !== date.getUTCMinutes() &&
              date.getUTCMinutes() % 2 === 0
            ) {
              console.log('2 mintues ran');
              // recalculate all signals
              self.getAllSignalSymbols().then((symbols) => {
                self.symbols = symbols;
                const _subscribe = {
                  eventName: 'subscribe',
                  authorization: process.env.TIINGO_KEY,
                  eventData: {
                    thresholdLevel: 5,
                    tickers: symbols.map((s) =>
                      s.symbol.replace('BINANCE:', ''),
                    ),
                  },
                };
                self.wsCrypto.send(JSON.stringify(_subscribe));

                const forexSymbols = [];

                for (const forex of forexList) {
                  forexSymbols.push({
                    symbol: forex.symbol
                      .replace('OANDA:', '')
                      .replace('_', '')
                      .toLowerCase(),
                    realSymbol: forex.symbol,
                    index: forex.index,
                  });
                }

                try {
                  self.apiService
                    .getTiingoForexPrices(
                      forexSymbols.map((f) => f.symbol).join(','),
                    )
                    .then((data) => {
                      for (const _forex of data) {
                        const { index, realSymbol } = forexSymbols.find(
                          (f) => f.symbol === _forex.ticker,
                        );

                        self.checkPrice(
                          self,
                          _forex.midPrice,
                          self.symbols[index],
                        );
                        try {
                          self.signalSymbolsService.updateSymbol({
                            symbol: realSymbol,
                            price: getPriceWithCorrectDecimals(_forex.midPrice),
                          });
                        } catch (e) {
                          console.log('updateSymbol error ', e);
                        }

                        // TODO hacer metodo para comparar precio actual con el anterior y segun el tipofoundSignal
                        self.symbols[index].previousPrice = _forex.midPrice;
                      }
                    });
                } catch (e) {
                  console.log('tiingo error ', e);
                }
              });

              self.minuteRan = date.getUTCMinutes();
            }
          }
        } catch (e) {
          console.log('ws error ', e);
        }
      });
    });
  }

  async getAllSignalSymbols() {
    this.symbols = [];
    if (this.signalsService && !this.symbols.length) {
      const _symbols = await this.signalsService.getSignals();

      for (const symbolIndex in _symbols) {
        const symbol = _symbols[symbolIndex];
        this.symbols.push({
          index: Number(symbolIndex),
          symbol: _symbols[symbolIndex].exchangeSymbol,
          type: symbol.type,
          id: symbol.id,
          takeProfits: symbol.takeProfits.filter((tp) => !tp.takeProfitReached),
          stopLost: symbol.stopLost,
          stopLostReached: symbol.stopLostReached,
          entryPrice: symbol.entryPrice,
          entryPriceReached: symbol.entryPriceReached,
        });
      }
    }
    return this.symbols;
  }

  async stopWebsocket(symbol: string) {
    console.log('stop', symbol);
    // this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }));
  }

  async getSymbolPrice(symbol: string): Promise<Decimal> {
    const _symbol = await this.signalSymbolsService.getSymbol(symbol);

    return _symbol.price;
  }
}

async function updateSignal(
  _this: any,
  foundSignal: SymbolData,
  stopLostReached: boolean,
  entryPriceReached: boolean,
  takeProfitReached = false,
) {
  const signal = await _this.signalsService.getSignal(foundSignal.id);

  console.log(
    'signal updated',
    signal.signal.symbol,
    stopLostReached,
    entryPriceReached,
    takeProfitReached,
  );
  if (stopLostReached) {
    signal.signal.stopLostReached = true;
    signal.signal.stopLostReachedDate = new Date();
  }
  if (entryPriceReached) {
    signal.signal.entryPriceReached = true;
    signal.signal.entryPriceReachedDate = new Date();
  }
  if (takeProfitReached) {
    signal.signal.takeProfits = signal.signal.takeProfits.map((tp) => {
      if (foundSignal.takeProfits.map((_tp) => _tp.id).indexOf(tp.id) > -1) {
        tp.takeProfitReached = true;
        tp.takeProfitReachedDate = new Date();
      }
      return tp;
    });
  }

  const signalUpdate = new UpdateDto(signal.signal);
  _this.signalsService.updateSignal(signalUpdate);
}
