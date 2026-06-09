import { IsString } from 'class-validator';

/** DTO обновления JWT-токена. */
export class RefreshTokenDto {
  @IsString()
  refresh: string;
}
