import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchPasswords } from '../../common/validators/match-passwords.validator.js';

/** DTO регистрации нового пользователя. */
export class RegisterDto {
  @IsString()
  @MaxLength(150)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  @MatchPasswords('password')
  password_confirm: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  last_name?: string;
}
