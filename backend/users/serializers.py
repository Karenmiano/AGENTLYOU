from core.models import Location
from core.serializers import LocationSerializer
from rest_framework import serializers
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    """

    location = LocationSerializer()
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "name",
            "password",
            "confirm_password",
            "location",
            "is_client",
            "is_agent",
            "default_role",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def __init__(self, *args, **kwargs):
        """
        Initialize the serializer instance.

        Sets the is_client and is_agent fields to read-only during user creation.
        These fields are set based on the default_role during user creation.
        """
        super().__init__(*args, **kwargs)

        if self.instance is None:
            # Make profile flags read-only during registration
            self.fields["is_client"].read_only = True
            self.fields["is_agent"].read_only = True

    def validate(self, data):
        """
        Validate the data provided for serialization.

        Ensures that the 'password' and 'confirm_password' fields match, else raises
        a ValidationError.
        """
        if data.get("password") != data.get("confirm_password"):
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        return data

    def create(self, validated_data):
        """
        Create a new user.

        Sets the 'is_client' and 'is_agent' flags based on the 'default_role'
        provided in the validated_data.
        """
        validated_data.pop("confirm_password")

        # Set profile flags based on default_role
        default_role = validated_data.get("default_role")
        validated_data["is_client"] = default_role == "client"
        validated_data["is_agent"] = default_role == "agent"

        location_data = validated_data.pop("location")
        location, _ = Location.objects.get_or_create(**location_data)
        validated_data["location"] = location

        user = CustomUser.objects.create_user(**validated_data)
        return user
