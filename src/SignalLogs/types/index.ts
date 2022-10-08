import { Exclude, Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { TakeProfit } from 'src/typeorm';
import { convertToBoolean } from 'src/utils/convertToBoolean';

export interface Signal {
  id: number;
  symbol: string;
  type: string;
  entryPrice: Decimal;
  stopLost: Decimal;
  risk: Decimal;
  stopLostReached: boolean;
  takeProfits: TakeProfit[];
}

export class SerializedSignalLog {
  id: number;
  description: string;
  created_at: Date;
  signal: Signal;

  constructor(partial: Partial<SerializedSignalLog>) {
    Object.assign(this, partial);
  }
}

const ToBoolean = () => {
  return Transform((params): boolean | undefined => {
    return convertToBoolean(params.value);
  });
};

export { ToBoolean };
