import { SignalLog, TakeProfit } from 'src/typeorm';
import Decimal from 'decimal.js';
import { SignalStatus } from 'src/typeorm/Signal';

export class Signal {
  constructor(
    public id: number,
    public symbol: string,
    public exchangeSymbol: string,
    public type: string,
    public entryPrice: Decimal,
    public stopLost: Decimal,
    public risk: Decimal,
    public stopLostReached: boolean,
    public stopLostReachedDate: Date,
    public entryPriceReached: boolean,
    public entryPriceReachedDate: Date,
    public takeProfits: TakeProfit[],
    public status: SignalStatus,
    public closeReason: string,
    public logs: SignalLog[],
  ) {}
}
