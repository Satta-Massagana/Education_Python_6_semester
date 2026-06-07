"""Модель мастер-класса."""

from django.conf import settings
from django.db import models
from django.utils import timezone


class Workshop(models.Model):
    """
    Мастер-класс, доступный для бронирования.

    Атрибуты:
        title: название мастер-класса;
        description: подробное описание;
        date: дата и время проведения;
        capacity: максимальное количество участников;
        created_by: администратор, создавший запись.
    """

    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    date = models.DateTimeField(verbose_name='Дата и время')
    capacity = models.PositiveIntegerField(verbose_name='Вместимость')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_workshops',
        verbose_name='Создал',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлён')

    class Meta:
        verbose_name = 'Мастер-класс'
        verbose_name_plural = 'Мастер-классы'
        ordering = ['date']

    def __str__(self) -> str:
        return self.title

    @property
    def is_past(self) -> bool:
        """Проверка, прошёл ли мастер-класс."""
        return self.date <= timezone.now()

    @property
    def available_seats(self) -> int:
        """Количество свободных мест."""
        booked = self.bookings.count()
        return max(0, self.capacity - booked)

    @property
    def is_full(self) -> bool:
        """Проверка заполненности мастер-класса."""
        return self.available_seats == 0
