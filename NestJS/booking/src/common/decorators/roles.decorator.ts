import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum.js';

/** Ключ метаданных для проверки ролей. */
export const ROLES_KEY = 'roles';

/** Декоратор: разрешённые роли для доступа к маршруту. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
