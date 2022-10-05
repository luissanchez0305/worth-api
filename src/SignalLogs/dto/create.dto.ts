import { IsNotEmpty } from 'class-validator';
import { Signal } from 'src/typeorm';

export class CreateDto {
  @IsNotEmpty()
  signal: Signal;

  @IsNotEmpty()
  description: string;

  constructor(signal: Signal, desciption: string) {
    this.signal = signal;
    this.description = desciption;
  }
}
