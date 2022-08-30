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

  @Get(':id')
  getUser(@Param() params) {
    return this.usersService.getUserId(params.id);
  }

  @Get(':id')
  getUserEmail(@Param() params) {
    return this.usersService.getUser(params.email);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() userDto: CreateDto) {
    const res = await this.usersService.createUser(userDto);
    console.log(res);
    return res;
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
