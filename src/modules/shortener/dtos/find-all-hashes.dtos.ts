import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindAllHashesDtos {
  @ApiProperty({ example: 1 })
  @Type(() => Number) // converte string → number
  @IsInt({ message: 'page deve ser um número inteiro' })
  @Min(1, { message: 'page deve ser no mínimo 1' })
  page: number;
}
