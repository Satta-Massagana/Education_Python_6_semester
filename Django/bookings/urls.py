"""URL-маршруты приложения bookings."""

from django.urls import path

from .views import BookingCancelView, BookingListCreateView

app_name = 'bookings'

urlpatterns = [
    path('', BookingListCreateView.as_view(), name='booking-list-create'),
    path('<int:pk>/', BookingCancelView.as_view(), name='booking-cancel'),
]
