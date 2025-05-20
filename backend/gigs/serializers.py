from rest_framework import serializers

from .models import Gig


class GigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gig
        fields = [
            "id",
            "title",
            "event_type",
            "location_type",
            "venue",
            "start_datetime",
            "end_datetime",
            "description",
            "compensation",
            "language_preference",
            "special_requirements",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        """
        Check that end datetime is after start datetime
        """
        if data.get("start_datetime") and data.get("end_datetime"):
            if data["end_datetime"] <= data["start_datetime"]:
                raise serializers.ValidationError(
                    "End datetime must be after start datetime"
                )
        return data
