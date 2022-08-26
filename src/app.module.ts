import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UsersModule } from './users/users.module';
import entities from './typeorm/index';
import { convertToBoolean } from './utils/convertToBoolean';
import { SymbolsModule } from './symbols/symbols.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SignalsModule } from './signals/signals.module';
import { MessagesModule } from './messages/messages.module';
import { APIModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    SymbolsModule,
    SignalsModule,
    CurrenciesModule,
    MessagesModule,
    APIModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT), //3306,
      username: process.env.DB_USERNAME, //'mainworth',
      password: process.env.DB_PASSWORD, //'qkjjTKHBe$eU1',
      database: process.env.DB_DATABASE, //'worth',
      entities,
      synchronize: convertToBoolean(process.env.DB_SYNCRONIZE), //true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
