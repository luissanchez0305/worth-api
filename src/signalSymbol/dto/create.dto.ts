import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import Decimal from 'decimal.js';
import { TakeProfit } from 'src/typeorm';

export class CreateDto {
  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  price: number;
}
