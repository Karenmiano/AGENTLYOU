from rest_framework import serializers

from core.models import Location


class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Location model.
    """

    class Meta:
        model = Location
        fields = ["id", "city", "state_region", "country"]

    def get_unique_together_validators(self):
        """
        Overriding method to disable unique together checks.
        """
        return []
