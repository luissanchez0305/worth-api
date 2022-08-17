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
const SibApiV3Sdk = require('sib-api-v3-typescript');

@Injectable()
export class UsersService {
  users: User[] = [];

  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find({
      order: {
        id: 'DESC',
      },
    });
    return users.map((user) => new SerializedUser(user));
  }

  async createUser(userDto: CreateDto) {
    const apiInstance = new SibApiV3Sdk.ContactsApi();

    const apiKey = apiInstance.authentications['apiKey'];

    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = userDto.email;
    createContact.attributes = {
      FIRSTNAME: userDto.name,
      LASTNAME: userDto.lastname,
      SMS: userDto.phone,
    };
    createContact.listIds = [1];

    try {
      await apiInstance.createContact(createContact);
      const newUser = this.userRepository.create(userDto);
      return await this.userRepository.save(newUser);
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

  async getUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async updateUserEmailCode(user: userEntity) {
    user.emailCode = randomCodeGenerator();
    return await this.userRepository.save(user);
  }

  async updateUserSMSCode(user: userEntity) {
    user.SMSCode = randomCodeGenerator();
    return await this.userRepository.save(user);
  }

  async updateUser(userDto: UpdateDto) {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (!user) {
      throw new Error('User does not exist');
    }
    userDto.isPremium = convertToBoolean(userDto.isPremium);
    return this.userRepository.update(user.id, userDto);
  }
}
