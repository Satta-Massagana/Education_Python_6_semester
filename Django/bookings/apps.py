"""Конфигурация приложения bookings."""

from django.apps import AppConfig


class BookingsConfig(AppConfig):
    """Настройки Django-приложения для бронирований."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bookings'
    verbose_name = 'Бронирования'
