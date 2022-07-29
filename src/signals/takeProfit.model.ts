import { Signal } from "src/typeorm";

export class TakeProfit {
  constructor(
    public id: number,
    public price: number,
    public signal: Signal,
    public takeProfitReached: boolean,
  ) {}
}
