export interface Currency {
  id: number;
  name: string;
  type: string;
  isShown: boolean;
}

export class SerializedCurrency {
  id: number;
  name: string;
  type: string;
  isShown: boolean;

  constructor(partial: Partial<SerializedCurrency>) {
    Object.assign(this, partial);
  }
}
