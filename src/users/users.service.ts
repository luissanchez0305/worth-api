import { Injectable } from '@nestjs/common';
import { User as userEntity } from './users.model';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedUser, ToBoolean, User } from './types/index';
import { Repository } from 'typeorm';
import { UpdateDto } from './dto/update.dto';
import { convertToBoolean } from '../utils/convertToBoolean';
import { randomCodeGenerator } from 'src/utils/randomCodeGenerator';
import { throwError } from 'rxjs';
import { MessagesService } from 'src/messages/messages.service';
import { DeviceDataDto } from 'src/orfanDevices/dto/deviceDataDto.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import Decimal from 'decimal.js';
import { APIService } from 'src/api/api.service';
import { getDecimalWithCorrectDecimals } from 'src/utils/decimalNumbers';
// const SibApiV3Sdk = require('sib-api-v3-typescript');

@Injectable()
export class UsersService {
  users: User[] = [];

  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
    private messagesService: MessagesService,
    private apiService: APIService,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find({
      order: {
        id: 'DESC',
      },
    });
    return users.map((user) => new SerializedUser(user));
  }

  async sendSignalPushNotification(
    type: string,
    symbol: string,
    action: string,
    price: Decimal | string,
  ) {
    const users = (await this.getPremiumUsers()).filter(
      (u) => u.oneSignal_id != 'NA',
    );
    users.forEach((user) => {
      if (user.oneSignal_id != 'NA') {
        this.apiService.sendPushNotification({
          token: user.oneSignal_id,
          sound: 'default',
          title: 'Worth App',
          body: `Signal: ${symbol
            .replace('BINANCE:', '')
            .replace('OANDA:', '')
            .replace('_', '')} - ${type}. El precio a llegado a ${
            typeof price === 'string'
              ? price
              : getDecimalWithCorrectDecimals(price)
          } en ${action}`,
        });
      }
    });
  }

  async createUser(userDto: CreateDto) {
    /* const apiInstance = new SibApiV3Sdk.ContactsApi();

    const apiKey = apiInstance.authentications['apiKey'];

    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = userDto.email;
    createContact.attributes = {
      FIRSTNAME: userDto.name,
      LASTNAME: userDto.lastname,
      SMS: userDto.phone,
    };
    createContact.listIds = [1]; */

    try {
      // await apiInstance.createContact(createContact);
      const newUser = this.userRepository.create(userDto);
      const res = await this.userRepository.save(newUser);
      await this.updateUserEmailCode(newUser);
      this.messagesService.sendEmailCode(newUser);
      await this.updateUserSMSCode(newUser);
      this.messagesService
        .sendSMSCode(newUser)
        .then((data) => {
          console.log('SUCCESS SMS', data);
        })
        .catch((error) => {
          console.log('ERROR SMS', error);
        });
      return res;
    } catch (e) {
      if (e.response) return e.response.body;
      else return { code: e.code, message: e.sqlMessage };
    }
  }

  async getUserId(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async getPremiumUsers() {
    const users = await this.userRepository.find({
      where: { isPremium: true },
    });
    return users;
  }

  async updateUserEmailCode(user: userEntity) {
    user.emailCode = randomCodeGenerator();
    user.isValidated = false;
    return await this.userRepository.save(user);
  }

  async resetEmailCode(user: userEntity) {
    user.emailCode = '';
    if (user.SMSCode.length == 0 && user.emailCode.length == 0) {
      user.isValidated = true;
    }
    await this.userRepository.save(user);
  }

  async updateUserSMSCode(user: userEntity) {
    user.SMSCode = randomCodeGenerator();
    user.isValidated = false;
    return await this.userRepository.save(user);
  }

  async resetSMSCode(user: userEntity) {
    user.SMSCode = '';
    if (user.SMSCode.length == 0 && user.emailCode.length == 0) {
      user.isValidated = true;
    }
    await this.userRepository.save(user);
  }

  async updateUser(userDto: UpdateDto | UpdateDeviceDto, currentEmail: string) {
    const user = await this.userRepository.findOne({
      where: { email: currentEmail },
    });
    if (!user) {
      throw new Error('User does not exist');
    }

    if (userDto instanceof UpdateDto) {
      userDto.isPremium = convertToBoolean(userDto.isPremium);
    }

    this.userRepository.update(user.id, userDto).then(async () => {
      if (userDto.email !== currentEmail) {
        user.email = userDto.email;
        await this.updateUserEmailCode(user);
        this.messagesService.sendEmailCode(user);
      }
    });
  }

  async getUserByDeviceId(deviceId: string) {
    return await this.userRepository.findOne({
      where: { deviceId: deviceId },
    });
  }
}
