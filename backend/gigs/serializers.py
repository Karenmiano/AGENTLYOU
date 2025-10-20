from rest_framework import serializers
from taggit.serializers import TaggitSerializer, TagListSerializerField

from gigs.models import Gig, Venue
from gigs.validators import validate_start_end_datetime, validate_location_fields
from core.models import Location
from core.serializers import LocationSerializer


class VenueSerializer(serializers.ModelSerializer):
    google_place_id = serializers.CharField()
    location = LocationSerializer()

    class Meta:
        model = Venue
        fields = ["id", "google_place_id", "name", "address", "location"]


class GigSerializer(TaggitSerializer, serializers.ModelSerializer):
    event_label = TagListSerializerField()
    venue = VenueSerializer(required=False, allow_null=True)
    status = serializers.ChoiceField(
        ["draft", "published"],
        default="draft",
        help_text="Status of the gig. Can be 'draft' or 'published' during creation. Direct updates will be ignored.",
    )

    class Meta:
        model = Gig
        fields = [
            "id",
            "title",
            "event_label",
            "description",
            "location_type",
            "venue",
            "start_datetime",
            "end_datetime",
            "timezone",
            "compensation",
            "status",
            "client",
            "agent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["client", "agent"]

    def __init__(self, *args, **kwargs):
        """
        Initialize the serializer instance.

        Set status to read-only during updates. Status updates depend on other fields and
        code paths hence will be set using model methods to ensure data integrity.
        """
        super().__init__(*args, **kwargs)

        if self.instance:
            self.fields["status"].read_only = True

    def validate(self, data):
        """
        Object-level validation for the gig.

        Ensures:
        - Start datetime is in the future.
        - End datetime is after start datetime.
        - Location fields are valid based on location type.
        """
        validate_start_end_datetime(
            data.get("start_datetime"), data.get("end_datetime")
        )

        validate_location_fields(data.get("location_type"), data.get("venue"))
        return data

    def create(self, validated_data):
        """
        Create a new gig instance.
        """
        if validated_data.get("venue"):
            venue = validated_data.pop("venue")
            location = venue.pop("location")
            location, _ = Location.objects.get_or_create(**location)
            venue, _ = Venue.objects.get_or_create(location=location, **venue)
            validated_data["venue"] = venue
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get("venue"):
            venue = validated_data.pop("venue")
            location = venue.pop("location")
            location, _ = Location.objects.get_or_create(**location)
            venue, _ = Venue.objects.get_or_create(location=location, **venue)
            validated_data["venue"] = venue
        return super().update(instance, validated_data)
