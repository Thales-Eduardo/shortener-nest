/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signIn(@Body() signInDto: Record<string, any>): Promise<void> {
    await this.usersService.create({
      username: signInDto.username,
      email: signInDto.email,
      password: signInDto.password,
    });
  }
}
