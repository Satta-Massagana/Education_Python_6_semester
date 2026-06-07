"""Сериализаторы для мастер-классов."""

from django.utils import timezone
from rest_framework import serializers

from .models import Workshop


class WorkshopSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения данных мастер-класса."""

    available_seats = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    is_past = serializers.BooleanField(read_only=True)
    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True,
        default=None,
    )

    class Meta:
        model = Workshop
        fields = (
            'id',
            'title',
            'description',
            'date',
            'capacity',
            'available_seats',
            'is_full',
            'is_past',
            'created_by_username',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'available_seats',
            'is_full',
            'is_past',
            'created_by_username',
            'created_at',
            'updated_at',
        )


class WorkshopCreateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания и обновления мастер-класса."""

    class Meta:
        model = Workshop
        fields = ('title', 'description', 'date', 'capacity')

    def validate_date(self, value):
        """Запрет создания мастер-классов в прошлом."""
        if value <= timezone.now():
            raise serializers.ValidationError(
                'Дата мастер-класса должна быть в будущем.'
            )
        return value

    def validate_capacity(self, value: int) -> int:
        """Проверка положительной вместимости."""
        if value < 1:
            raise serializers.ValidationError(
                'Вместимость должна быть не менее 1.'
            )
        return value
