/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
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

  @UseGuards(AuthGuard)
  @Get('all_hashes/:page')
  async findAllHashes(
    @Request() req: any,
    @Param('page') page: string,
  ): Promise<any[]> {
    const user_id = req.user.sub;
    return this.shortenerService.findAllHashes(user_id, Number(page));
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('update_url/:hash')
  async updateUserUrl(
    @Request() req: any,
    @Param('hash') hash: string,
    @Body('newUrl') newUrl: string,
  ): Promise<void> {
    const user_id = req.user.sub;
    await this.shortenerService.updateUserUrl(hash, newUrl, user_id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete_url/:hash')
  async deleteUserUrl(
    @Request() req: any,
    @Param('hash') hash: string,
  ): Promise<void> {
    const user_id = req.user.sub;
    await this.shortenerService.deleteUserUrl(hash, user_id);
  }
}
