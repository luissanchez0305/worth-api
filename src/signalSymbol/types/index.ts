import Decimal from 'decimal.js';

export class SerializedCurrency {
  id: number;
  symbol: string;
  price: Decimal;

  constructor(partial: Partial<SerializedCurrency>) {
    Object.assign(this, partial);
  }
}
