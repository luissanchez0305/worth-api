import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APIController } from './api.controller';
import { APIService } from './api.service';

@Module({
  controllers: [APIController],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [APIService],
})
export class APIModule {}