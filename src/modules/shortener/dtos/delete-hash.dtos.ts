import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class DeleteUrlDtos {
  @ApiProperty()
  @IsString({ message: 'hash deve ser uma string' })
  @Length(6, 6, { message: 'hash deve conter exatamente 6 caracteres' })
  hash: string;
}
