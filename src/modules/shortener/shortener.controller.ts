/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('shorten_url')
  async createUserUrl(@Body() data: any): Promise<Record<string, string>> {
    const result = await this.shortenerService.createUserUrl({ ...data });
    return { url: result };
  }

  @Get('all_hashes/:user_id')
  async findAllHashes(@Param('user_id') user_id: string): Promise<any[]> {
    return this.shortenerService.findAllHashes(user_id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('update_url/:hash')
  async updateUserUrl(
    @Param('hash') hash: string,
    @Body('newUrl') newUrl: string,
  ): Promise<void> {
    return this.shortenerService.updateUserUrl(hash, newUrl);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete_url/:hash')
  async deleteUserUrl(@Param('hash') hash: string): Promise<void> {
    return this.shortenerService.deleteUserUrl(hash);
  }
}
