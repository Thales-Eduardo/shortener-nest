import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneAuth(email);
    if (!user) {
      throw new BadRequestException('E-mail ou senha está errado.');
    }

    const hash = await compare(password, user.password);
    if (!hash) throw new BadRequestException('E-mail ou senha está errado.');

    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
