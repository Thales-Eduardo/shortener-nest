import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { ShortnerRepository } from 'src/repository/shortnerRepository';
import { User } from '../../entity/User';

// This should be a real class/interface representing a user entity

interface CreateUserDtos {
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly shortnerRepository: ShortnerRepository;

  constructor(database: ShortnerRepository) {
    this.shortnerRepository = database;
  }

  async create(user: CreateUserDtos): Promise<void> {
    const userExists = await this.shortnerRepository.findByEmail(user.email);
    if (userExists) {
      throw new Error('Email already exists');
    }
    //encriptar a senha
    const password = await hash(user.password, 8);
    user.password = password;

    // salvar o usuário no banco de dados
    await this.shortnerRepository.createUser({
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  async findOneAuth(email: string): Promise<User | null> {
    return await this.shortnerRepository.findByEmail(email);
  }
}
