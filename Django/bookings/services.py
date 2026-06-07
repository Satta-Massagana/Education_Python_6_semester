"""Бизнес-логика создания и отмены бронирований."""

from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from workshops.models import Workshop

from .models import Booking


class BookingService:
    """Сервис для операций с бронированиями."""

    @staticmethod
    def get_user_bookings(user):
        """
        Получение бронирований текущего пользователя.

        Args:
            user: авторизованный пользователь.

        Returns:
            QuerySet: бронирования с данными мастер-класса.
        """
        return (
            Booking.objects
            .filter(user=user)
            .select_related('workshop', 'workshop__created_by')
        )

    @staticmethod
    def validate_booking(user, workshop: Workshop) -> None:
        """
        Проверка возможности бронирования.

        Args:
            user: пользователь;
            workshop: мастер-класс.

        Raises:
            ValidationError: при нарушении правил бронирования.
        """
        if workshop.is_past:
            raise ValidationError(
                'Нельзя записаться на прошедший мастер-класс.'
            )

        if workshop.is_full:
            raise ValidationError(
                'Мастер-класс полностью забронирован.'
            )

        if Booking.objects.filter(user=user, workshop=workshop).exists():
            raise ValidationError(
                'Вы уже записаны на этот мастер-класс.'
            )

    @staticmethod
    @transaction.atomic
    def create_booking(user, workshop_id: int) -> Booking:
        """
        Создание бронирования с проверкой вместимости.

        Args:
            user: авторизованный пользователь;
            workshop_id: идентификатор мастер-класса.

        Returns:
            Booking: созданное бронирование.

        Raises:
            ValidationError: при ошибках валидации.
        """
        try:
            workshop = (
                Workshop.objects
                .select_for_update()
                .prefetch_related('bookings')
                .get(pk=workshop_id)
            )
        except Workshop.DoesNotExist as exc:
            raise ValidationError('Мастер-класс не найден.') from exc

        BookingService.validate_booking(user, workshop)

        try:
            booking = Booking.objects.create(user=user, workshop=workshop)
        except IntegrityError as exc:
            raise ValidationError(
                'Вы уже записаны на этот мастер-класс.'
            ) from exc

        return booking

    @staticmethod
    def cancel_booking(user, booking_id: int) -> None:
        """
        Отмена бронирования пользователем.

        Args:
            user: владелец бронирования;
            booking_id: идентификатор бронирования.

        Raises:
            ValidationError: если бронирование не найдено или не принадлежит пользователю.
        """
        try:
            booking = Booking.objects.select_related('workshop').get(
                pk=booking_id,
                user=user,
            )
        except Booking.DoesNotExist as exc:
            raise ValidationError('Бронирование не найдено.') from exc

        if booking.workshop.date <= timezone.now():
            raise ValidationError(
                'Нельзя отменить бронирование на прошедший мастер-класс.'
            )

        booking.delete()
