"""Представления веб-клиента."""

from django.views.generic import TemplateView


class IndexView(TemplateView):
    """Главная страница клиентского приложения."""

    template_name = 'client/index.html'
