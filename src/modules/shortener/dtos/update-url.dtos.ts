/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsUrl, Length } from 'class-validator';

export class UpdateUrlDto {
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
  @IsString({ message: 'hash deve ser uma string' })
  @Length(6, 6, { message: 'hash deve ter exatamente 6 caracteres' })
  hash: string;
}
