import { BadRequestException, Injectable } from '@nestjs/common';
import { ShortnerRepository } from '../../repository/shortnerRepository';

@Injectable()
export class ShortenerService {
  private readonly shortnerRepository: ShortnerRepository;

  constructor(database: ShortnerRepository) {
    this.shortnerRepository = database;
  }

  async createUserUrl({
    user_id,
    url_original,
  }: {
    url_original: string;
    user_id?: string;
  }): Promise<string> {
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

  async findAllHashes(user_id: string): Promise<any[]> {
    const result = await this.shortnerRepository.findAllHashes(user_id);
    if (!result || result.length === 0) {
      throw new BadRequestException('No hashes found for this user');
    }

    return result;
  }

  async updateUserUrl(hash: string, newUrl: string): Promise<void> {
    return this.shortnerRepository.updateUserUrl(hash, newUrl);
  }

  async deleteUserUrl(hash: string): Promise<void> {
    return this.shortnerRepository.deleteUserUrl(hash);
  }
}
