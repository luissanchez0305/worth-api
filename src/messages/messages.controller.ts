import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { randomCodeGenerator } from 'src/utils/randomCodeGenerator';
import { EmailDto } from './dto/email.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('email-code')
  async sendEmailCode(@Body() emailDto: EmailDto) {
    const user = await this.usersService.getUser(emailDto.email);
    await this.usersService.updateUserEmailCode(user);
    return this.messagesService.sendEmailCode(user);
  }

  @Post('sms-code')
  async sendSMSCode(@Body() emailDto: EmailDto) {
    const user = await this.usersService.getUser(emailDto.email);
    await this.usersService.updateUserSMSCode(user);
    return this.messagesService.sendSMSCode(user);
  }
}
