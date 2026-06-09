import { SetMetadata } from '@nestjs/common';

/** Ключ метаданных для публичных маршрутов без JWT. */
export const IS_PUBLIC_KEY = 'isPublic';

/** Декоратор: маршрут доступен без авторизации. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
