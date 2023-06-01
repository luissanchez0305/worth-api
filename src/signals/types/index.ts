import { Exclude, Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { convertToBoolean } from 'src/utils/convertToBoolean';
import { TakeProfit } from '../takeProfit.model';

export interface Signal {
  id: number;
  symbol: string;
  type: string;
  entryPrice: Decimal;
  stopLost: Decimal;
  risk: number;
  stopLostReached: boolean;
  takeProfits: [];
}

export class SerializedSignal {
  id: number;
  symbol: string;
  exchangeSymbol: string;
  type: string;
  entryPrice: Decimal;
  entryPriceReached: boolean;
  takeProfits: TakeProfit[];
  stopLost: Decimal;
  stopLostReached: boolean;

  constructor(partial: Partial<SerializedSignal>) {
    Object.assign(this, partial);
  }
}

const ToBoolean = () => {
  return Transform((params): boolean | undefined => {
    return convertToBoolean(params.value);
  });
};

export { ToBoolean };
