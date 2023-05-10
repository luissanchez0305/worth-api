import Decimal from 'decimal.js';
import { Signal } from 'src/signals/signals.model';
import { TakeProfit } from 'src/typeorm';

export interface SymbolData {
  id: number;
  index: number;
  symbol: string;
  type?: string;
  previousPrice?: Decimal;
  signal?: Signal;
  stopLost?: Decimal;
  entryPrice?: Decimal;
  checkProfit?: TakeProfit;
  takeProfits?: TakeProfit[];
}
