from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import CustomUser


def validate_client(value):
    """
    Custom validator to ensure the user is a client.
    """
    client = CustomUser.objects.get(pk=value)
    if not client.is_client:
        raise ValidationError("Client must be an actual client in app.")


def validate_agent(value):
    """
    Custom validator to ensure the user is an agent.
    """
    agent = CustomUser.objects.get(pk=value)
    if not agent.is_agent:
        raise ValidationError("Agent must be an actual agent in app.")


def validate_start_end_datetime(start_datetime, end_datetime):
    """
    Validate that the start datetime is in the future and the end datetime is after the start datetime.
    """
    if start_datetime < timezone.now():
        raise ValidationError(
            {"start_datetime": "Start date and time must be in the future."}
        )

    if end_datetime <= start_datetime:
        raise ValidationError(
            {"end_datetime": "End date and time must come after start date and time."}
        )


def validate_location_fields(location_type, venue, location):
    """
    Validate location fields based on location type.
    - For virtual gigs, venue and location should not be provided.
    - For physical and hybrid gigs, venue and location must be provided.
    """

    if location_type == "virtual":
        if venue or location:
            raise ValidationError(
                {
                    "location_type": "Venue and location are not appropriate for virtual gigs."
                }
            )

    if location_type in ["physical", "hybrid"]:
        if not venue:
            raise ValidationError(
                {"venue": "Venue is required for physical and hybrid gigs."}
            )
        if not location:
            raise ValidationError(
                {"location": "Location is required for physical and hybrid gigs."}
            )
