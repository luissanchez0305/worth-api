import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TakeProfit } from './TakeProfit';
import { DecimalTransformer } from '../utils/decimal.transformer';
import Decimal from 'decimal.js';

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

  @Column('decimal', { precision: 10, scale: 8, transformer: new DecimalTransformer()  })
  entryPrice: Decimal;

  @Column('decimal', { precision: 10, scale: 8, transformer: new DecimalTransformer()  })
  stopLost: Decimal;

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

  @Column('decimal', { precision: 10, scale: 4, transformer: new DecimalTransformer()  })
  risk: Decimal;
}
