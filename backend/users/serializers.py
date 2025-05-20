from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
            "city",
            "country",
            "has_agent_profile",
            "has_client_profile",
            "default_role",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data.get("password") != data.get("confirm_password"):
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        # ensuring consistency in role fields during registration
        if self.instance is None:
            if data.get("default_role") == "client":
                data["has_client_profile"] = True
                data["has_agent_profile"] = False
            elif data.get("default_role") == "agent":
                data["has_agent_profile"] = True
                data["has_client_profile"] = False

        return data

    def create(self, validated_data):
        """
        Create a new user.
        """
        user = CustomUser.objects.create_user(**validated_data)
        return user
