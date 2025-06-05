import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Length } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({
    example: 'https://www.w3schools.com/tags/default.asp',
  })
  @IsString({ message: 'newUrl deve ser uma string' })
  @IsUrl(
    {
      require_protocol: true,
      //   protocols: ['https'], // só https
    },
    { message: 'newUrl deve ser uma URL válida (ex: https://...)' },
  )
  newUrl: string;
}

export class HashParamDto {
  @ApiProperty()
  @IsString({ message: 'hash deve ser uma string' })
  @Length(6, 6, { message: 'hash deve ter exatamente 6 caracteres' })
  hash: string;
}
