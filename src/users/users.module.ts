import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { MessagesModule } from 'src/messages/messages.module';
import { APIModule } from 'src/api/api.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MessagesModule, APIModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
