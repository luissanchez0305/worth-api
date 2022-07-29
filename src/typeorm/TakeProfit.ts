import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Signal } from './Signal';

@Entity()
export class TakeProfit {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => Signal, (signal) => signal.takeProfits)
  signal: Signal;

  @Column()
  price: number;

  @Column({ default: false })
  takeProfitReached: boolean;
}
