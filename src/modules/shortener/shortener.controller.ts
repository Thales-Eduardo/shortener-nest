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
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateShortenedUrl } from './dtos/create-shortened-url.dtos';
import { DeleteUrlDtos } from './dtos/delete-hash.dtos';
import { FindAllHashesDtos } from './dtos/find-all-hashes.dtos';
import { HashParamDto, UpdateUrlDto } from './dtos/update-url.dtos';
import { ShortenerService } from './shortener.service';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('shorten_url')
  async createUserUrl(
    @Body(ValidationPipe) data: CreateShortenedUrl,
  ): Promise<Record<string, string>> {
    const result = await this.shortenerService.createUserUrl(data);
    return { url: result };
  }

  @UseGuards(AuthGuard)
  @Get('all_hashes/:page')
  async findAllHashes(
    @Request() req: any,
    @Param(ValidationPipe) data: FindAllHashesDtos,
  ): Promise<any[]> {
    const user_id = req.user.sub;
    return this.shortenerService.findAllHashes(user_id, data.page);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('update_url/:hash')
  async updateUserUrl(
    @Request() req: any,
    @Param() data: HashParamDto,
    @Body(ValidationPipe) newUrlData: UpdateUrlDto,
  ): Promise<void> {
    const user_id = req.user.sub;
    await this.shortenerService.updateUserUrl(
      data.hash,
      newUrlData.newUrl,
      user_id,
    );
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete_url/:hash')
  async deleteUserUrl(
    @Request() req: any,
    @Param() data: DeleteUrlDtos,
  ): Promise<void> {
    const user_id = req.user.sub;
    await this.shortenerService.deleteUserUrl(data.hash, user_id);
  }
}
