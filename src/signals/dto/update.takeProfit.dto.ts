import { IsNotEmpty } from 'class-validator';
import { TakeProfit } from '../takeProfit.model';

export class UpdateDtoTakeProfit {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  price: number;

  takeProfitReached: boolean;

  takeProfitReachedDate: Date;

  constructor(item: TakeProfit) {
    Object.assign(this, item);
  }
}
