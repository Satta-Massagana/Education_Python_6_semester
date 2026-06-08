#!/usr/bin/env python
"""Скрипт запуска приложения в Docker: ожидание БД, миграции, создание админа."""

import os
import socket
import subprocess
import sys
import time


def wait_for_database() -> None:
    """Ожидание готовности PostgreSQL."""
    host = os.environ.get('POSTGRES_HOST', 'db')
    port = int(os.environ.get('POSTGRES_PORT', '5432'))

    print('Ожидание PostgreSQL...')
    while True:
        try:
            with socket.create_connection((host, port), timeout=1):
                break
        except OSError:
            time.sleep(1)
    print('PostgreSQL доступен.')


def run_migrations() -> None:
    """Применение миграций Django."""
    subprocess.run(
        [sys.executable, 'manage.py', 'migrate', '--noinput'],
        check=True,
    )


def collect_static() -> None:
    """Сбор статических файлов в папку staticfiles для WhiteNoise."""
    subprocess.run(
        [sys.executable, 'manage.py', 'collectstatic', '--noinput', '--clear'],
        check=True,
    )


def create_admin_user() -> None:
    """Создание администратора по умолчанию, если его ещё нет."""
    script = """
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpass123')
    print('Создан администратор: admin / adminpass123')
"""
    subprocess.run(
        [sys.executable, 'manage.py', 'shell', '-c', script],
        check=True,
    )


def start_gunicorn() -> None:
    """Запуск WSGI-сервера."""
    os.execvp(
        'gunicorn',
        [
            'gunicorn',
            'booking.wsgi:application',
            '--bind', '0.0.0.0:8000',
            '--workers', '3',
        ],
    )


def main() -> None:
    """Точка входа при старте контейнера."""
    wait_for_database()
    run_migrations()
    collect_static()
    create_admin_user()
    start_gunicorn()


if __name__ == '__main__':
    main()
