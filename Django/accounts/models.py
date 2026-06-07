"""Модели пользователей системы бронирования мастер-классов."""

from django.contrib.auth.models import AbstractUser, UserManager as BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Менеджер для создания пользователей с поддержкой ролей."""

    def create_user(self, username, email=None, password=None, **extra_fields):
        """Создание обычного пользователя."""
        extra_fields.setdefault('role', 'user')
        return super().create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        """Создание администратора с ролью admin."""
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):
    """
    Пользователь системы с поддержкой ролей.

    Роли:
        - admin: полный доступ к CRUD мастер-классов;
        - user: просмотр мастер-классов и управление своими бронированиями.
    """

    class Role(models.TextChoices):
        """Доступные роли пользователя."""

        ADMIN = 'admin', 'Администратор'
        USER = 'user', 'Пользователь'

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.USER,
        verbose_name='Роль',
    )

    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    @property
    def is_admin(self) -> bool:
        """Проверка, является ли пользователь администратором."""
        return self.role == self.Role.ADMIN

    def __str__(self) -> str:
        return self.username
