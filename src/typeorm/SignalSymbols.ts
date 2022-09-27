import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DecimalTransformer } from '../utils/decimal.transformer';
import Decimal from 'decimal.js';

@Entity()
export class SignalSymbols {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    unique: true,
  })
  symbol: string;

  @Column('decimal', {
    precision: 20,
    scale: 8,
    transformer: new DecimalTransformer(),
  })
  price: Decimal;
}
