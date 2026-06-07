"""API-представления для мастер-классов."""

from rest_framework import generics, permissions, status
from rest_framework.response import Response

from accounts.permissions import IsAdminRole

from .models import Workshop
from .serializers import WorkshopCreateUpdateSerializer, WorkshopSerializer
from .services import WorkshopService


class WorkshopListView(generics.ListAPIView):
    """
    Публичный список мастер-классов.

    GET: доступен всем пользователям.
    POST: создание — только для администратора.
    """

    serializer_class = WorkshopSerializer

    def get_queryset(self):
        """Получение списка мастер-классов."""
        return WorkshopService.get_all_workshops()

    def get_permissions(self):
        """Разные права для GET и POST."""
        if self.request.method == 'POST':
            return [IsAdminRole()]
        return [permissions.AllowAny()]

    def post(self, request, *args, **kwargs) -> Response:
        """Создание нового мастер-класса администратором."""
        serializer = WorkshopCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        workshop = WorkshopService.create_workshop(
            user=request.user,
            validated_data=serializer.validated_data,
        )
        return Response(
            WorkshopSerializer(workshop).data,
            status=status.HTTP_201_CREATED,
        )


class WorkshopDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Детали мастер-класса.

    GET: публичный доступ.
    PUT/PATCH/DELETE: только администратор.
    """

    queryset = Workshop.objects.select_related('created_by').prefetch_related(
        'bookings'
    )
    serializer_class = WorkshopSerializer

    def get_permissions(self):
        """Разные права для чтения и изменения."""
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsAdminRole()]

    def get_serializer_class(self):
        """Разные сериализаторы для чтения и записи."""
        if self.request.method in ('PUT', 'PATCH'):
            return WorkshopCreateUpdateSerializer
        return WorkshopSerializer

    def update(self, request, *args, **kwargs) -> Response:
        """Обновление мастер-класса."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = WorkshopCreateUpdateSerializer(
            instance,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)
        workshop = WorkshopService.update_workshop(
            instance,
            serializer.validated_data,
        )
        return Response(WorkshopSerializer(workshop).data)

    def destroy(self, request, *args, **kwargs) -> Response:
        """Удаление мастер-класса."""
        instance = self.get_object()
        WorkshopService.delete_workshop(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
