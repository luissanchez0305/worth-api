export interface Symbol {
  id: number;
  from: string;
  to: string;
  type: string;
  showMarquee: boolean;
}

export class SerializedSymbol {
  id: number;
  from: string;
  to: string;
  type: string;

  constructor(partial: Partial<SerializedSymbol>) {
    Object.assign(this, partial);
  }
}
