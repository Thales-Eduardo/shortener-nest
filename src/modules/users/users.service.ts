import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User } from '../../entity/User';
import { UserRepository } from '../../repository/userRepository';

// This should be a real class/interface representing a user entity

interface CreateUserDtos {
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly userRepository: UserRepository;

  constructor(database: UserRepository) {
    this.userRepository = database;
  }

  async create(user: CreateUserDtos): Promise<void> {
    const userExists = await this.userRepository.findByEmail(user.email);
    if (userExists) {
      throw new Error('Email already exists');
    }
    //encriptar a senha
    const password = await hash(user.password, 8);
    user.password = password;

    // salvar o usuário no banco de dados
    await this.userRepository.createUser({
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  async findOneAuth(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async delete(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.delete(userId);
  }
}
