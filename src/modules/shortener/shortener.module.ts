import { Module } from '@nestjs/common';
import { ShortnerRepository } from '../../repository/shortnerRepository';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

@Module({
  providers: [ShortenerService, ShortnerRepository],
  controllers: [ShortenerController],
  exports: [ShortenerService],
})
export class ShortenerModule {}
