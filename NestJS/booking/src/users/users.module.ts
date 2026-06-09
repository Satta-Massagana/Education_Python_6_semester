import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { AuthController } from './auth.controller.js';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

/** Модуль пользователей и аутентификации. */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'access-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [UsersService, UsersRepository, JwtStrategy],
  exports: [UsersService, UsersRepository, JwtModule],
})
export class UsersModule {}
