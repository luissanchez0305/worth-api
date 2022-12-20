import Decimal from 'decimal.js';
import { Signal } from 'src/signals/signals.model';
import { TakeProfit } from 'src/typeorm';

export interface SymbolData {
  symbol: string;
  previousPrice: Decimal;
  signal: Signal;
  checkProfit: TakeProfit;
  takeProfits: TakeProfit[];
}
