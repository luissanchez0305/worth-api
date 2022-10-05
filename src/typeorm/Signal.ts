import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TakeProfit } from './TakeProfit';
import { DecimalTransformer } from '../utils/decimal.transformer';
import Decimal from 'decimal.js';
import { getCurrentUTC } from 'src/utils/date';
import { SignalLog } from './SignalLog';

export enum SignalStatus {
  NotStarted = 'not_started',
  EntryPriceReached = 'ep_reached',
  Deactivated = 'deactivated',
}

@Entity()
export class Signal {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column()
  symbol: string;

  @Column()
  exchangeSymbol: string;

  @Column()
  type: string;

  @Column('decimal', {
    precision: 20,
    scale: 8,
    transformer: new DecimalTransformer(),
  })
  entryPrice: Decimal;

  @Column('decimal', {
    precision: 20,
    scale: 8,
    transformer: new DecimalTransformer(),
  })
  stopLost: Decimal;

  @Column({ default: false })
  stopLostReached: boolean;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  stopLostReachedDate: Date;

  @Column({ default: false })
  entryPriceReached: boolean;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  entryPriceReachedDate: Date;

  @OneToMany(() => TakeProfit, (takeProfit) => takeProfit.signal, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  takeProfits: TakeProfit[];

  @Column('decimal', {
    precision: 10,
    scale: 4,
    transformer: new DecimalTransformer(),
  })
  risk: Decimal;

  @Column({
    default: SignalStatus.NotStarted,
    type: 'enum',
    enum: SignalStatus,
  })
  status: SignalStatus;

  @Column({
    nullable: true,
  })
  closeReason: string;

  @OneToMany(() => SignalLog, (log) => log.signal, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  logs: SignalLog[];
}
