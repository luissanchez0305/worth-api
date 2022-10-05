import { Signal } from 'src/typeorm';
import Decimal from 'decimal.js';

export class TakeProfit {
  constructor(
    public id: number,
    public price: Decimal,
    public signal: Signal,
    public takeProfitReached: boolean,
    public takeProfitReachedDate: Date,
  ) {}
}
