import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, ValidateNested } from 'class-validator';
import { TakeProfit } from 'src/typeorm';

export class CreateDto {
  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  entryPrice: number;

  @IsNotEmpty()
  stopLost: number;

  stopLostReached: boolean;

  @IsNotEmpty()
  risk: number;

  // @ValidateNested({ each: true })
  @Type(() => TakeProfit)
  takeProfits: TakeProfit[];
}
