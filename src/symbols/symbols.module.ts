import { Module } from '@nestjs/common';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Symbol } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Symbol])],
  controllers: [SymbolsController],
  providers: [SymbolsService],
})
export class SymbolsModule {}
