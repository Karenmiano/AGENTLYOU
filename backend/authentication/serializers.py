from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for handling JWT token generation with user role information.
    """

    @classmethod
    def get_token(cls, user):
        """
        Generate a token for the user, add default_role, is_client, and is_agent
        to the token.
        """
        token = super().get_token(user)

        token["default_role"] = user.default_role
        token["is_client"] = user.is_client
        token["is_agent"] = user.is_agent

        return token


class LogoutSerializer(serializers.Serializer):
    """
    Serializer for logging out a user. Ensures that the refresh token is provided.
    """

    refresh = serializers.CharField()
