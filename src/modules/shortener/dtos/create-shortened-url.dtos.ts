/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateShortenedUrl {
  @IsNotEmpty({ message: 'Necessário informar url_original' })
  @IsString({ message: 'O url_original deve ser string' })
  url_original: string;

  @IsOptional()
  @IsString({ message: 'O user_id deve ser string' })
  @IsUUID(undefined, { message: 'O user_id deve ser um UUID válido' })
  user_id?: string;
}
