"""Сериализаторы для бронирований."""

from rest_framework import serializers

from workshops.serializers import WorkshopSerializer

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    """Сериализатор для отображения бронирования с данными мастер-класса."""

    workshop = WorkshopSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'workshop', 'created_at')
        read_only_fields = fields


class BookingCreateSerializer(serializers.Serializer):
    """Сериализатор для создания бронирования."""

    workshop_id = serializers.IntegerField(min_value=1)

    def validate_workshop_id(self, value: int) -> int:
        """Проверка существования мастер-класса."""
        from workshops.models import Workshop

        if not Workshop.objects.filter(pk=value).exists():
            raise serializers.ValidationError('Мастер-класс не найден.')
        return value
