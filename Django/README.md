# Workshop Booking System

Система управления бронированием мастер-классов на Django + Django REST Framework.

## Возможности

- Регистрация и авторизация пользователей (JWT-токены)
- Просмотр списка мастер-классов (публичный доступ)
- Запись на мастер-класс (авторизованные пользователи)
- Просмотр и отмена своих бронирований
- CRUD мастер-классов для администратора
- Веб-клиент с обработкой ошибок и состояний загрузки

## Стек технологий

- Python 3.12, Django 6, Django REST Framework
- PostgreSQL 16
- JWT-аутентификация (simplejwt)
- Docker, docker-compose, Gunicorn

## Структура проекта

```
Django/
├── accounts/       # Пользователи, регистрация, JWT
├── workshops/      # Мастер-классы (модели, сервисы, API)
├── bookings/       # Бронирования (модели, сервисы, API)
├── client/         # Веб-клиент (шаблоны)
├── booking/        # Настройки Django-проекта
├── static/         # CSS, JS
├── templates/      # HTML-шаблоны
├── postman/        # Postman-коллекция
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## Быстрый старт (Docker)

```
cd Django
docker-compose up --build
```

Приложение: http://localhost:8000  
API: http://localhost:8000/api/  
Админ по умолчанию: `admin` / `adminpass123`

## Локальный запуск (без Docker)

```
cd Django
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # настройте POSTGRES_HOST=localhost, POSTGRES_PORT=5433
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API-эндпоинты

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| POST | `/api/auth/register/` | Публичный | Регистрация |
| POST | `/api/auth/login/` | Публичный | Получение JWT-токена |
| POST | `/api/auth/token/refresh/` | Публичный | Обновление токена |
| GET | `/api/auth/profile/` | Авторизованный | Профиль пользователя |
| GET | `/api/workshops/` | Публичный | Список мастер-классов |
| POST | `/api/workshops/` | Админ | Создание мастер-класса |
| GET | `/api/workshops/{id}/` | Публичный | Детали мастер-класса |
| PUT | `/api/workshops/{id}/` | Админ | Обновление мастер-класса |
| DELETE | `/api/workshops/{id}/` | Админ | Удаление мастер-класса |
| GET | `/api/bookings/` | Авторизованный | Свои бронирования |
| POST | `/api/bookings/` | Авторизованный | Создание бронирования |
| DELETE | `/api/bookings/{id}/` | Авторизованный | Отмена бронирования |

## Postman

Импортируйте коллекцию `postman/Workshop_Booking.postman_collection.json`.  
Переменные: `base_url`, `access_token`, `workshop_id`, `booking_id`.

## Модели данных

- **User** — пользователь с ролями `admin` / `user`
- **Workshop** — мастер-класс (название, описание, дата, вместимость)
- **Booking** — бронирование (связь user ↔ workshop, уникальность пары)

## Бизнес-правила

- Нельзя записаться на прошедший мастер-класс
- Нельзя превысить вместимость
- Один пользователь — одна бронь на мастер-класс
- Пользователь видит только свои бронирования
