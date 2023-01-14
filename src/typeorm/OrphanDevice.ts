import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrphanDevice {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column()
  deviceId: string;

  @Column()
  oneSignal_id: string;
}
