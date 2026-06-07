"""Модель бронирования мастер-класса."""

from django.conf import settings
from django.db import models


class Booking(models.Model):
    """
    Бронирование пользователя на мастер-класс.

    Один пользователь может забронировать мастер-класс только один раз
    (ограничение unique_together).
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='Пользователь',
    )
    workshop = models.ForeignKey(
        'workshops.Workshop',
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='Мастер-класс',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'workshop'],
                name='unique_user_workshop_booking',
            ),
        ]

    def __str__(self) -> str:
        return f'{self.user.username} -> {self.workshop.title}'
