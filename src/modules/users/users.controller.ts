/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signIn(@Body() signInDto: Record<string, any>): Promise<void> {
    await this.usersService.create({
      username: signInDto.username,
      email: signInDto.email,
      password: signInDto.password,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:user_id')
  async delete(@Param('user_id') user_id: string): Promise<void> {
    await this.usersService.delete(user_id);
  }
}
