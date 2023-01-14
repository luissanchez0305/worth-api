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
import { APIService } from 'src/api/api.service';
import { randomCodeGenerator } from 'src/utils/randomCodeGenerator';
import { ValidateUserDto } from './dto/email.dto';
import { MessagesService } from './messages.service';
import { NotificationDto } from './dto/notificationDto';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly apiService: APIService,
  ) {}

  @Post('email-code-send')
  async sendEmailCode(@Body() emailDto: ValidateUserDto) {
    const user = await this.usersService.getUserByEmail(emailDto.email);
    await this.usersService.updateUserEmailCode(user);
    return this.messagesService.sendEmailCode(user);
  }

  @Post('email-code-validate')
  async validateEmailCode(@Body() emailDto: ValidateUserDto) {
    const user = await this.usersService.getUserByEmail(emailDto.email);
    if (user.emailCode == emailDto.code) {
      await this.usersService.resetEmailCode(user);
      return { valid: true };
    }
    return { valid: false };
  }

  @Post('sms-code-send')
  async sendSMSCode(@Body() emailDto: ValidateUserDto) {
    const user = await this.usersService.getUserByEmail(emailDto.email);
    await this.usersService.updateUserSMSCode(user);
    return this.messagesService.sendSMSCode(user);
  }

  @Post('sms-code-validate')
  async validateSMSCode(@Body() validateDto: ValidateUserDto) {
    const user = await this.usersService.getUserByEmail(validateDto.email);
    if (user.SMSCode == validateDto.code) {
      await this.usersService.resetSMSCode(user);
      return { valid: true };
    }
    return { valid: false };
  }

  @Post('send-push-notfication')
  async sendPushNotification(@Body() notificationDto: NotificationDto) {
    return await this.apiService.sendPushNotification(notificationDto);
  }
}
