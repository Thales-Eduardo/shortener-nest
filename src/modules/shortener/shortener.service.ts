/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ShortnerRepository } from '../../repository/shortnerRepository';
import { CreateShortenedUrl } from './dtos/create-shortened-url.dtos';

@Injectable()
export class ShortenerService {
  private readonly shortnerRepository: ShortnerRepository;

  constructor(database: ShortnerRepository) {
    this.shortnerRepository = database;
  }

  async createUserUrl({
    user_id,
    url_original,
  }: CreateShortenedUrl): Promise<string> {
    const result = await this.shortnerRepository.createUserUrl(
      url_original,
      user_id ?? undefined,
    );

    if (!result) {
      throw new BadRequestException('Failed to create user URL');
    }
    return `${process.env.BASE_URL}/${result}`;
  }

  async findByHash(
    hash: string,
  ): Promise<{ url_original: string } | undefined> {
    const result = await this.shortnerRepository.findByHash(hash);
    if (!result) {
      throw new BadRequestException('Hash not found');
    }

    return { url_original: result.url_original };
  }

  async findAllHashes(user_id: string, page: number): Promise<any[]> {
    const result = await this.shortnerRepository.findAllHashes(user_id, page);
    if (!result || result.length === 0) {
      throw new BadRequestException('No hashes found for this user');
    }

    return result;
  }

  async updateUserUrl(
    hash: string,
    newUrl: string,
    user_id: string,
  ): Promise<void> {
    const result = await this.shortnerRepository.updateUserUrl(
      hash,
      newUrl,
      user_id,
    );
    if (!result) {
      throw new BadRequestException('Failed to update user URL');
    }
  }

  async deleteUserUrl(
    hash: string,
    user_id: string,
  ): Promise<void | undefined> {
    const result = this.shortnerRepository.deleteUserUrl(hash, user_id);
    if (!result) {
      throw new BadRequestException('Failed to delete user URL');
    }
  }
}
