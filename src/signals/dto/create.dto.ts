import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TakeProfit } from 'src/typeorm';

export class CreateDto {
  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  entryPrice: number;

  entryPriceReached: boolean;

  entryPriceReachedDate: Date;

  @IsNotEmpty()
  stopLost: number;

  stopLostReached: boolean;

  stopLostReachedDate: Date;

  @IsNotEmpty()
  risk: number;

  // @ValidateNested({ each: true })
  @Type(() => TakeProfit)
  takeProfits: TakeProfit[];
}
