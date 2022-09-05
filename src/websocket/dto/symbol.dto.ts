import { IsEmail, IsNotEmpty } from 'class-validator';

export class SymbolDto {
  @IsNotEmpty()
  symbol: string;

  price: number;
}
