import { Module } from '@nestjs/common';
import { SignalsController } from './signals.controller';
import { SignalsService } from './signals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Signal, TakeProfit } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Signal, TakeProfit])],
  controllers: [SignalsController],
  providers: [SignalsService],
  exports: [SignalsService],
})
export class SignalsModule {}
