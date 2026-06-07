"""Бизнес-логика работы с мастер-классами."""

from .models import Workshop


class WorkshopService:
    """Сервис для операций с мастер-классами."""

    @staticmethod
    def get_all_workshops():
        """
        Получение списка мастер-классов с оптимизацией запросов.

        Returns:
            QuerySet: все мастер-классы, отсортированные по дате.
        """
        return (
            Workshop.objects
            .select_related('created_by')
            .prefetch_related('bookings')
            .order_by('date')
        )

    @staticmethod
    def get_workshop_detail(workshop_id: int):
        """
        Получение детальной информации о мастер-классе.

        Args:
            workshop_id: идентификатор мастер-класса.

        Returns:
            Workshop: объект мастер-класса.
        """
        return (
            Workshop.objects
            .select_related('created_by')
            .prefetch_related('bookings')
            .get(pk=workshop_id)
        )

    @staticmethod
    def create_workshop(user, validated_data: dict) -> Workshop:
        """
        Создание нового мастер-класса администратором.

        Args:
            user: пользователь-администратор;
            validated_data: проверенные данные мастер-класса.

        Returns:
            Workshop: созданный мастер-класс.
        """
        return Workshop.objects.create(created_by=user, **validated_data)

    @staticmethod
    def update_workshop(workshop: Workshop, validated_data: dict) -> Workshop:
        """
        Обновление существующего мастер-класса.

        Args:
            workshop: объект мастер-класса;
            validated_data: новые данные.

        Returns:
            Workshop: обновлённый мастер-класс.
        """
        for field, value in validated_data.items():
            setattr(workshop, field, value)
        workshop.save()
        return workshop

    @staticmethod
    def delete_workshop(workshop: Workshop) -> None:
        """
        Удаление мастер-класса.

        Args:
            workshop: объект для удаления.
        """
        workshop.delete()
