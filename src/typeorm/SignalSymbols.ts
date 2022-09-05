import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TakeProfit } from './TakeProfit';
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
    precision: 10,
    scale: 8,
    transformer: new DecimalTransformer(),
  })
  price: Decimal;
}
