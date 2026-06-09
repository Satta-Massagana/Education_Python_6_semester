import { IsString } from 'class-validator';

/** DTO входа в систему. */
export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
