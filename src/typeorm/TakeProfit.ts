import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Signal } from './Signal';
import { DecimalTransformer } from '../utils/decimal.transformer';
import Decimal from 'decimal.js';
import { IsDecimal } from 'class-validator';

@Entity()
export class TakeProfit {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => Signal, (signal) => signal.takeProfits)
  signal: Signal;

  @Column('decimal', {
    precision: 20,
    scale: 8,
    transformer: new DecimalTransformer(),
  })
  @IsDecimal()
  price: Decimal;

  @Column({ default: false })
  takeProfitReached: boolean;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  takeProfitReachedDate: Date;
}
