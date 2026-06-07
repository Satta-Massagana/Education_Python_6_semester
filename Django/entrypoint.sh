#!/bin/bash
set -e

echo "Ожидание PostgreSQL..."
while ! python -c "
import socket, os
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(1)
try:
    s.connect((os.environ.get('POSTGRES_HOST', 'db'), int(os.environ.get('POSTGRES_PORT', '5432'))))
    s.close()
except Exception:
    exit(1)
" 2>/dev/null; do
    sleep 1
done
echo "PostgreSQL доступен."

python manage.py migrate --noinput
python manage.py collectstatic --noinput 2>/dev/null || true

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpass123')
    print('Создан администратор: admin / adminpass123')
"

exec gunicorn booking.wsgi:application --bind 0.0.0.0:8000 --workers 3
