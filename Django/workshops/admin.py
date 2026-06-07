"""Регистрация моделей мастер-классов в админ-панели."""

from django.contrib import admin

from .models import Workshop


@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    """Админ-интерфейс для управления мастер-классами."""

    list_display = ('title', 'date', 'capacity', 'created_by', 'created_at')
    list_filter = ('date',)
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
