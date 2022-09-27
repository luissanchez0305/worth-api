import { TakeProfit } from "src/typeorm";
import Decimal from 'decimal.js';

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
    public takeProfits: TakeProfit[],
  ) {}
}
