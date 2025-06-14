/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from '../database';

@Injectable()
export class ShortnerRepository {
  //adicionar hash
  async createHash(
    hash: string,
    available: boolean,
    limit_hash: number,
  ): Promise<boolean> {
    try {
      return await prismaClient.$transaction(async (tx: any) => {
        const hashCount = await tx.hASHES.count();
        if (hashCount >= limit_hash) {
          return false;
        }

        const existingHash = await tx.hASHES.findUnique({
          where: { hash },
        });
        if (existingHash) {
          console.log('Hash já existe');
          return false;
        }

        await tx.hASHES.create({
          data: {
            hash,
            available,
            created_at: new Date(),
          },
        });
        return true;
      });
    } catch (err) {
      console.error('Erro durante a operação:', err);
      return false;
    }
  }

  async createUserUrl(
    url_original: string,
    user_id?: string,
  ): Promise<string | undefined> {
    return await prismaClient.$transaction(async (tx) => {
      const [selected] = await tx.$queryRaw<Array<{ hash: string }>>(
        Prisma.raw(`
            WITH selected_hash AS (
              SELECT hash
              FROM hashes
              WHERE available = TRUE
              ORDER BY created_at ASC
              LIMIT 1
              FOR UPDATE SKIP LOCKED
            )
            UPDATE hashes
            SET available = FALSE
            WHERE hash = (SELECT hash FROM selected_hash)
            RETURNING hash;
        `),
      );

      if (!selected) {
        return undefined;
      }

      const hash = selected.hash;

      await tx.hASHUSER.create({
        data: {
          hash,
          user_id: user_id ?? null,
          available: true,
          url_original,
        },
      });

      return hash;
    });
  }

  async findByHash(
    hash: string,
  ): Promise<{ url_original: string } | undefined> {
    const result = await prismaClient.hASHUSER.findFirst({
      where: {
        hash,
        available: true,
      },
      select: {
        url_original: true,
      },
    });

    if (!result || result.url_original === null) {
      return undefined;
    }

    return { url_original: result.url_original };
  }

  async findAllHashes(user_id: string, page: number): Promise<any[]> {
    return await prismaClient.hASHUSER.findMany({
      skip: (page - 1) * 10,
      take: 10,
      where: {
        user_id,
        available: true,
      },
      orderBy: {
        created_at: 'desc', // os mais recentes primeiro
      },
    });
  }

  async updateUserUrl(
    hash: string,
    newUrl: string,
    user_id: string,
  ): Promise<boolean> {
    const entry = await prismaClient.hASHUSER.findFirst({
      where: { hash, user_id },
    });

    if (!entry) {
      return false;
    }

    await prismaClient.hASHUSER.update({
      where: { hash },
      data: {
        url_original: newUrl,
        // @updatedAt att auto
      },
    });

    return true;
  }

  async deleteUserUrl(
    hash: string,
    user_id: string,
  ): Promise<void | undefined> {
    const entry = await prismaClient.hASHUSER.findFirst({
      where: { hash, user_id },
    });

    if (!entry) {
      return undefined;
    }

    await prismaClient.hASHUSER.update({
      where: { hash, user_id },
      data: {
        available: false,
        // `updated_at` att auto defaults/@updatedAt
      },
    });
  }

  async countUserUrls(hash: string): Promise<void> {
    await prismaClient.hASHUSER.update({
      where: { hash },
      data: {
        count_access: { increment: 1 },
        // `updated_at` att auto defaults/@updatedAt
      },
    });
  }
}
