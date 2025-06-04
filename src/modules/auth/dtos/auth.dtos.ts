/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDtos {
  @IsNotEmpty({ message: 'Necessário informar email' })
  @IsString({ message: 'O email deve ser string' })
  email: string;

  @IsNotEmpty({ message: 'Necessário informar senha' })
  @IsString({ message: 'A senha deve ser string' })
  password: string;
}
