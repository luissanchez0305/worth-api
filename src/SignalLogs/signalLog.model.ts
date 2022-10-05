import { Signal } from 'src/typeorm';

export class SignalLog {
  constructor(
    public id: number,
    public signal: Signal,
    public description: string,
    public created_at: Date,
  ) {}
}
