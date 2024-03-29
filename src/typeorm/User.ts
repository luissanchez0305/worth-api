import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  phone: string;

  @Column({
    nullable: true,
    default: '',
  })
  emailCode: string;

  @Column({
    nullable: true,
    default: '',
  })
  SMSCode: string;

  @Column({
    nullable: true,
    default: false,
  })
  isValidated: boolean;

  @Column({
    nullable: true,
    default: 'NA',
  })
  oneSignal_id: string;

  @Column({
    nullable: true,
    default: false,
  })
  isPremium: boolean;

  @Column({
    nullable: true,
  })
  deviceId: string;
}
