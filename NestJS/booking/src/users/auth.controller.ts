import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';

/** Контроллер аутентификации и профиля пользователя. */
@Controller('api/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  /** Регистрация нового пользователя. */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  /** Вход и получение JWT-токенов. */
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  /** Обновление access-токена. */
  @Public()
  @Post('token/refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.usersService.refreshToken(dto.refresh);
  }

  /** Профиль текущего авторизованного пользователя. */
  @Get('profile')
  profile(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id);
  }
}
