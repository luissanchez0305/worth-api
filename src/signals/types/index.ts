import { Exclude, Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { convertToBoolean } from 'src/utils/convertToBoolean';

export interface Signal {
  id: number;
  symbol: string;
  type: string;
  entryPrice: number;
  stopLost: number;
  risk: number;
  stopLostReached: boolean;
}

export class SerializedSignal {
  id: number;
  symbol: string;
  type: string;
  entryPrice: number;

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
