# Workshop Booking System (NestJS)

Система управления бронированием мастер-классов на NestJS + TypeORM + PostgreSQL.

## Возможности

- Регистрация и JWT-аутентификация
- Просмотр мастер-классов (публичный доступ)
- Бронирование и отмена записи
- CRUD мастер-классов для администратора
- Веб-клиент с обработкой ошибок и загрузки

## Стек

- NestJS 11, TypeScript
- TypeORM, PostgreSQL
- Passport JWT, class-validator
- Docker, docker-compose

## Структура

```
src/
├── users/          # Пользователи, JWT, регистрация
├── workshops/      # Мастер-классы
├── bookings/       # Бронирования
├── common/         # Guards, декораторы, валидаторы
├── database/       # Миграции TypeORM
public/             # Веб-клиент (HTML, CSS, JS)
postman/            # Postman-коллекция
```

## Быстрый старт (Docker)

```
cd NestJS/booking
docker-compose up --build
```

- Приложение: http://localhost:3000
- API: http://localhost:3000/api
- Админ: `admin` / `adminpass123`

## Локальный запуск

```
npm install
copy .env.example .env
npm run start:dev
```

БД: `localhost:5434`, `booking_user` / `securepass` / `booking_db`

## API

| Метод | URL | Доступ |
|-------|-----|--------|
| POST | `/api/auth/register` | Публичный |
| POST | `/api/auth/login` | Публичный |
| POST | `/api/auth/token/refresh` | Публичный |
| GET | `/api/auth/profile` | JWT |
| GET | `/api/workshops` | Публичный |
| POST | `/api/workshops` | Admin |
| GET | `/api/workshops/:id` | Публичный |
| PUT | `/api/workshops/:id` | Admin |
| DELETE | `/api/workshops/:id` | Admin |
| GET | `/api/bookings` | JWT |
| POST | `/api/bookings` | JWT |
| DELETE | `/api/bookings/:id` | JWT |

## Postman

Импортируйте `postman/Workshop_Booking.postman_collection.json`

Переменные: `base_url`, `access_token`, `workshop_id`, `booking_id`
