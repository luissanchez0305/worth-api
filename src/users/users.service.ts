import { Injectable } from '@nestjs/common';
import { User as userEntity } from './users.model';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedUser, ToBoolean, User } from './types/index';
import { Repository } from 'typeorm';
import { UpdateDto } from './dto/update.dto';
import { convertToBoolean } from '../utils/convertToBoolean';

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
        name: 'ASC',
        id: 'DESC',
      },
    });
    return users.map((user) => new SerializedUser(user));
  }

  async createUser(userDto: CreateDto) {
    const newUser = this.userRepository.create(userDto);
    return await this.userRepository.save(newUser);
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
