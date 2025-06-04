/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { prismaClient } from '../database';

@Injectable()
export class ShortnerRepository {
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

        console.log('Hash inserida com sucesso');
        return true;
      });
    } catch (err) {
      console.error('Erro durante a operação:', err);
      return false;
    }
  }
}
