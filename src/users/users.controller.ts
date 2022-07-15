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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from './dto/create.dto';
import { SerializedUser } from './types/index';
import { UpdateDto } from './dto/update.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<SerializedUser[]> {
    return this.usersService.getUsers();
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() userDto: CreateDto) {
    return this.usersService.createUser(userDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  update(@Body() userDto: UpdateDto): any {
    try {
      return this.usersService.updateUser(userDto);
    } catch (ex) {
      return { error: ex };
    }
  }
}
