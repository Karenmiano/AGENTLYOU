from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import UserSerializer


class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():

            user = serializer.save()

            # log in user and return access and refresh tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            token_pair = {
                "access": access_token,
                "refresh": refresh_token,
            }

            return Response(token_pair, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            email_errors = errors.get("email", None)

            if email_errors:
                if "user with this email already exists." in email_errors:
                    return Response(
                        {"error": "User with this email already exists."},
                        status=status.HTTP_409_CONFLICT,
                    )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
