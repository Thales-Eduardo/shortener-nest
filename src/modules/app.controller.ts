import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Redirect,
} from '@nestjs/common';
import { ShortenerService } from './shortener/shortener.service';

@Controller()
export class AppController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Get(':hash')
  @Redirect('', HttpStatus.FOUND)
  async redirectByHash(@Param('hash') hash: string) {
    const url = await this.shortenerService.findByHash(hash);
    if (!url) {
      throw new NotFoundException('Hash not found');
    }

    return { url: url.url_original };
  }
}
