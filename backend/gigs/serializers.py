from rest_framework import serializers

from gigs.models import Gig
from gigs.validators import validate_start_end_datetime, validate_location_fields
from core.models import Location


class GigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gig
        fields = [
            "id",
            "title",
            "event_label",
            "description",
            "location_type",
            "venue",
            "location",
            "start_datetime",
            "end_datetime",
            "compensation",
            "status",
            "client",
            "agent",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["client"]

    def validate(self, data):
        validate_start_end_datetime(
            data.get("start_datetime"), data.get("end_datetime")
        )

        validate_location_fields(
            data.get("location_type"), data.get("venue"), data.get("location", None)
        )
        return data

    def create(self, validated_data):
        if validated_data.get("location"):
            location = validated_data.pop("location")
            location, _ = Location.objects.get_or_create(**location)
            validated_data["location"] = location
        return super().create(validated_data)
