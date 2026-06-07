"""API-представления для бронирований."""

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Booking
from .serializers import BookingCreateSerializer, BookingSerializer
from .services import BookingService


class BookingListCreateView(generics.ListCreateAPIView):
    """
    Список и создание бронирований.

    GET: просмотр своих бронирований (авторизованный пользователь).
    POST: создание бронирования (авторизованный пользователь).
    """

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BookingSerializer

    def get_queryset(self):
        """Возврат только бронирований текущего пользователя."""
        return BookingService.get_user_bookings(self.request.user)

    def create(self, request, *args, **kwargs) -> Response:
        """Создание нового бронирования."""
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            booking = BookingService.create_booking(
                user=request.user,
                workshop_id=serializer.validated_data['workshop_id'],
            )
        except ValidationError as exc:
            raise exc

        booking = (
            Booking.objects
            .select_related('workshop', 'workshop__created_by')
            .prefetch_related('workshop__bookings')
            .get(pk=booking.pk)
        )
        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED,
        )


class BookingCancelView(APIView):
    """Отмена (удаление) собственного бронирования."""

    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, pk: int) -> Response:
        """Удаление бронирования по идентификатору."""
        try:
            BookingService.cancel_booking(request.user, pk)
        except ValidationError as exc:
            raise exc
        return Response(status=status.HTTP_204_NO_CONTENT)
