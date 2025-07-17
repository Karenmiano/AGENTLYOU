from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from taggit.serializers import TaggitSerializer, TagListSerializerField

from gigs.models import Gig
from gigs.validators import validate_start_end_datetime, validate_location_fields
from core.models import Location
from core.serializers import LocationSerializer


class GigSerializer(TaggitSerializer, serializers.ModelSerializer):
    location = LocationSerializer(required=False)
    event_label = TagListSerializerField()

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
        try:
            gig = Gig.objects.create(**validated_data)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict)

        return gig
