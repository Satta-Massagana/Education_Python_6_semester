import { UserRole } from '../../common/enums/user-role.enum.js';
import { User } from '../entities/user.entity.js';

/** Безопасное представление пользователя в ответах API. */
export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;

  /** Преобразование сущности User в DTO ответа. */
  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.firstName ?? '',
      last_name: user.lastName ?? '',
      role: user.role,
    };
  }
}
