import { Module } from '@nestjs/common';
import { ShortnerRepository } from 'src/repository/shortnerRepository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, ShortnerRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
