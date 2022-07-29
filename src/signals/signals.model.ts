import { TakeProfit } from "src/typeorm";

export class Signal {
  constructor(
    public id: number,
    public symbol: string,
    public type: string,
    public entryPrice: number,
    public stopLost: number,
    public risk: number,
    public stopLostReached: boolean,
    public takeProfits: TakeProfit[],
  ) {}
}
