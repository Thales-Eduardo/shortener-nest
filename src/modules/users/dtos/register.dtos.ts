/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDtos {
  @IsNotEmpty({ message: 'Necessário informar username' })
  @IsString({ message: 'O username deve ser string' })
  username: string;

  @IsNotEmpty({ message: 'Necessário informar email' })
  @IsString({ message: 'O email deve ser string' })
  email: string;

  @IsNotEmpty({ message: 'Necessário informar senha' })
  @IsString({ message: 'A senha deve ser string' })
  @MinLength(6)
  password: string;
}
