"""API-представления для регистрации и профиля пользователя."""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserRegistrationSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """Регистрация нового пользователя в системе."""

    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs) -> Response:
        """Создание пользователя и возврат данных без пароля."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class ProfileView(APIView):
    """Получение профиля текущего авторизованного пользователя."""

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request) -> Response:
        """Возврат данных текущего пользователя."""
        return Response(UserSerializer(request.user).data)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Выдача JWT-токена при успешной аутентификации."""

    pass
