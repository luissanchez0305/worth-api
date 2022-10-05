import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Signal } from './Signal';

@Entity()
export class SignalLog {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => Signal, (signal) => signal.logs)
  @JoinColumn()
  signal: Signal;

  @Column()
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'NOW()',
  })
  created_at: Date;
}
