import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalSymbols } from 'src/typeorm';
import { SignalSymbolsService } from 'src/signalSymbol/signalSymbol.service';
import { SignalSymbolsModule } from 'src/signalSymbol/signalSymbol.module';

@Module({
  imports: [
    SignalSymbolsModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [WebsocketController],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketsModule {}
