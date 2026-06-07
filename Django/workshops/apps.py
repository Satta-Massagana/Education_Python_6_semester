"""Конфигурация приложения workshops."""

from django.apps import AppConfig


class WorkshopsConfig(AppConfig):
    """Настройки Django-приложения для мастер-классов."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'workshops'
    verbose_name = 'Мастер-классы'
