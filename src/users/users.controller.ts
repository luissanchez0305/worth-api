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
  Query,
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

  @Get('/email/:email')
  getUserEmail(@Param() params) {
    return this.usersService.getUser(params.email);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() userDto: CreateDto) {
    const res = await this.usersService.createUser(userDto);
    return res;
  }

  @Put(':email')
  @UsePipes(ValidationPipe)
  update(
    @Body() userDto: UpdateDto,
    @Param('email') currentEmail: string,
  ): any {
    try {
      return this.usersService.updateUser(userDto, currentEmail);
    } catch (ex) {
      return { error: ex };
    }
  }
}
