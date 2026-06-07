"""Регистрация моделей бронирований в админ-панели."""

from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Админ-интерфейс для управления бронированиями."""

    list_display = ('user', 'workshop', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'workshop__title')
    readonly_fields = ('created_at',)
