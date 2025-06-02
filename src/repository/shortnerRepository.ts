import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User } from '../entity/User';

export const prismaClient = new PrismaClient({
  // log: ['query'],
});

interface CreateUserDtos {
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class ShortnerRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findFirst({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return new User({
      userId: user.id,
      username: user.name,
      email: user.email,
      password: user.password,
    });
  }

  async createUser(user: CreateUserDtos): Promise<void> {
    await prismaClient.user.create({
      data: {
        name: user.username,
        email: user.email,
        password: user.password,
      },
    });
  }
}
