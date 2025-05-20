from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from users.serializers import UserSerializer


class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
