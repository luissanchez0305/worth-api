import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UsersModule } from './users/users.module';
import entities from './typeorm/index';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { convertToBoolean } from './utils/convertToBoolean';
import { SymbolsModule } from './symbols/symbols.module';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    SymbolsModule,
    CurrenciesModule,
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
