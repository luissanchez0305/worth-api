import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  isShown: boolean;
}
