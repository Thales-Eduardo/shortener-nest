/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, Length } from 'class-validator';

export class DeleteUrlDtos {
  @IsString({ message: 'hash deve ser uma string' })
  @Length(6, 6, { message: 'hash deve conter exatamente 6 caracteres' })
  hash: string;
}
