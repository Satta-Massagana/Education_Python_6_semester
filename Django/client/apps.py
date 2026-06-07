"""Конфигурация клиентского приложения."""

from django.apps import AppConfig


class ClientConfig(AppConfig):
    """Настройки Django-приложения для веб-клиента."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'client'
    verbose_name = 'Веб-клиент'
