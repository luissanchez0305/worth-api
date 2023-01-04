import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { MailgunModule } from 'nestjs-mailgun';
import { HttpModule } from '@nestjs/axios';
import { APIService } from 'src/api/api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MailgunModule.forAsyncRoot({
      useFactory: async () => {
        return {
          username: process.env.MAILGUN_USERNAME,
          key: process.env.MAILGUN_API_KEY,
          // public_key: 'string', // OPTIONAL
          timeout: 100000, // OPTIONAL, in milliseconds
          // url: 'string', // OPTIONAL, default: 'api.mailgun.net'. Note that if you are using the EU region the host should be set to 'api.eu.mailgun.net'
        };
      },
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, UsersService, APIService],
  exports: [MessagesService],
})
export class MessagesModule {}
