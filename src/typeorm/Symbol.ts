import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Symbol {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  type: string;

  @Column({
    nullable: true,
    default: false,
  })
  showMarquee: boolean;
}
