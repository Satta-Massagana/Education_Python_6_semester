import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums/user-role.enum.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { User } from './entities/user.entity.js';
import { UsersRepository } from './users.repository.js';

/** Сервис управления пользователями и аутентификацией. */
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  /** Создание администратора по умолчанию при старте приложения. */
  async onModuleInit(): Promise<void> {
    const adminExists = await this.usersRepository.findByUsername('admin');
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('adminpass123', 10);
      const admin = this.usersRepository.create({
        username: 'admin',
        email: 'admin@example.com',
        password: passwordHash,
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(admin);
      console.log('Создан администратор: admin / adminpass123');
    }
  }

  /** Регистрация нового пользователя. */
  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existingUsername = await this.usersRepository.findByUsername(
      dto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Пользователь с таким именем уже существует.');
    }

    const existingEmail = await this.usersRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Пользователь с таким email уже существует.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      username: dto.username,
      email: dto.email,
      password: passwordHash,
      firstName: dto.first_name,
      lastName: dto.last_name,
      role: UserRole.USER,
    });

    const saved = await this.usersRepository.save(user);
    return UserResponseDto.fromEntity(saved);
  }

  /** Аутентификация и выдача JWT-токенов. */
  async login(dto: LoginDto): Promise<{ access: string; refresh: string }> {
    const user = await this.usersRepository.findByUsernameWithPassword(
      dto.username,
    );

    if (!user) {
      throw new UnauthorizedException('Неверные учётные данные.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учётные данные.');
    }

    return this.generateTokens(user);
  }

  /** Обновление access-токена по refresh-токену. */
  async refreshToken(refresh: string): Promise<{ access: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: number }>(refresh, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      });
      const user = await this.usersRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден.');
      }
      const access = this.jwtService.sign(
        { sub: user.id, username: user.username, role: user.role },
        { expiresIn: '1h' },
      );
      return { access };
    } catch {
      throw new UnauthorizedException('Недействительный refresh-токен.');
    }
  }

  /** Получение профиля пользователя. */
  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден.');
    }
    return UserResponseDto.fromEntity(user);
  }

  /** Генерация пары JWT-токенов. */
  private generateTokens(user: User): { access: string; refresh: string } {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
        expiresIn: '7d',
      }),
    };
  }
}
