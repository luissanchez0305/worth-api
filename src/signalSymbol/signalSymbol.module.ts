import { Module } from '@nestjs/common';
import { SignalSymbolsService } from './signalSymbol.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalSymbols } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SignalSymbols])],
  providers: [SignalSymbolsService],
  exports: [SignalSymbolsService],
})
export class SignalSymbolsModule {}
