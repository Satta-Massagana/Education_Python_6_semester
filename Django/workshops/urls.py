"""URL-маршруты приложения workshops."""

from django.urls import path

from .views import WorkshopDetailView, WorkshopListView

app_name = 'workshops'

urlpatterns = [
    path('', WorkshopListView.as_view(), name='workshop-list'),
    path('<int:pk>/', WorkshopDetailView.as_view(), name='workshop-detail'),
]
