import { CacheModule, Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { HttpModule } from '@nestjs/axios';
import { SignalSymbolsModule } from 'src/signalSymbol/signalSymbol.module';
import { SignalsModule } from 'src/signals/signals.module';
import { SignalLogsModule } from 'src/SignalLogs/signalLogs.module';
import { APIModule } from 'src/api/api.module';
import { APIService } from 'src/api/api.service';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SignalSymbolsModule,
    SignalsModule,
    SignalLogsModule,
    MessagesModule,
    UsersModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register(),
  ],
  controllers: [WebsocketController],
  providers: [WebsocketService, APIService],
  exports: [WebsocketService],
})
export class WebsocketsModule {}
