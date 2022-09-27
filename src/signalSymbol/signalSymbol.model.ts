import Decimal from 'decimal.js';

export class SignalSymbols {
  constructor(
    public id: number,
    public symbol: string,
    public price: Decimal,
  ) {}
}
