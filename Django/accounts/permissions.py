"""Кастомные классы прав доступа."""

from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Доступ только для пользователей с ролью администратора."""

    message = 'Доступ разрешён только администраторам.'

    def has_permission(self, request, view) -> bool:
        """Проверка роли admin у авторизованного пользователя."""
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_admin
        )
