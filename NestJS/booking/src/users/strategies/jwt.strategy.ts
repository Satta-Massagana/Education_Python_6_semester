import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../common/enums/user-role.enum.js';
import { UsersRepository } from '../users.repository.js';
import { User } from '../entities/user.entity.js';

/** Payload JWT access-токена. */
export interface JwtPayload {
  sub: number;
  username: string;
  role: UserRole;
}

/** Passport-стратегия проверки JWT. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'access-secret-key',
    });
  }

  /** Загрузка пользователя по ID из токена. */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден.');
    }
    return user;
  }
}
