import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TakeProfit } from './TakeProfit';

@Entity()
export class Signal {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column()
  symbol: string;

  @Column()
  type: string;

  @Column()
  entryPrice: number;

  @Column()
  stopLost: number;

  @Column({default: false})
  stopLostReached: boolean;

  @OneToMany(
    type => TakeProfit, 
    takeProfit => takeProfit.signal, 
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate:'CASCADE'
    }
  )
  takeProfits: TakeProfit[];

  @Column()
  risk: number;
}
