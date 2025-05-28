from rest_framework import serializers
from django.utils import timezone
from .models import Gig
from core.models import Location


class GigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gig
        fields = [
            "id",
            "title",
            "event_type",
            "description",
            "location_type",
            "venue",
            "location",
            "start_datetime",
            "end_datetime",
            "compensation",
            "expenses",
            "status",
            "client",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["client"]

    def validate(self, data):
        if data.get("end_datetime") <= data.get("start_datetime"):
            raise serializers.ValidationError(
                {
                    "end_datetime": "End date and time must be greater than start date and time.",
                }
            )

        if data.get("start_datetime") < timezone.now():
            raise serializers.ValidationError(
                {"start_datetime": "Start date and time must be in the future."}
            )

        if data.get("location_type") in ["physical", "hybrid"]:
            if not data.get("venue"):
                raise serializers.ValidationError(
                    {"venue": "Venue is required for physical and hybrid gigs."}
                )

            if not data.get("location"):
                raise serializers.ValidationError(
                    {"location": "Location is required for physical and hybrid gigs."}
                )

    def create(self, validated_data):
        if validated_data.get("location"):
            location = validated_data.pop("location")
            location, _ = Location.objects.get_or_create(**location)
            validated_data["location"] = location
        return super().create(validated_data)
