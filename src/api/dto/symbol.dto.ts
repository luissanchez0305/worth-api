import { IsNotEmpty } from 'class-validator';

export class SymbolDTO {
  @IsNotEmpty()
  base: string;

  @IsNotEmpty()
  quote: string;

  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;
}
