import uuid
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MinValueValidator
from django.db import models
from taggit.managers import TaggableManager
from taggit.models import GenericUUIDTaggedItemBase, TaggedItemBase

from gigs.validators import (
    validate_client,
    validate_agent,
    validate_start_end_datetime,
    validate_location_fields,
)


class UUIDTaggedItem(GenericUUIDTaggedItemBase, TaggedItemBase):
    """
    Custom Through model that uses UUIDs for object IDs
    """

    pass


class Gig(models.Model):

    LOCATION_TYPE_CHOICES = [
        ("virtual", "Virtual"),
        ("physical", "Physical"),
        ("hybrid", "Hybrid"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("agent_confirmed", "Agent Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    # gig details
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    event_label = TaggableManager(through=UUIDTaggedItem, verbose_name="Event Label")
    description = models.TextField(
        validators=[MinLengthValidator(50, "Must be at least 50 characters long")]
    )

    # location
    location_type = models.CharField(max_length=10, choices=LOCATION_TYPE_CHOICES)
    venue = models.CharField(max_length=255, blank=True, default="")
    location = models.ForeignKey(
        "core.Location",
        on_delete=models.SET_NULL,
        related_name="gigs",
        null=True,
        blank=True,
    )

    # date and time
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    compensation = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))]
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="draft",
    )

    client = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.CASCADE,
        related_name="gigs",
        validators=[validate_client],
    )

    agent = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        related_name="agent_gigs",
        null=True,
        blank=True,
        validators=[validate_agent],
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gigs"

    def publish(self):
        """
        Publish the gig, setting its status to 'published'.
        Only gigs with status 'draft' can be published.
        Otherwise a ValidationError is raised.
        """
        if self.status != "draft":
            raise ValidationError(
                {"status": "Only gigs with status 'draft' can be published"}
            )

        self.status = "published"
        self.save()

    def clean(self):
        """
        Validate model fields.
        Ensures:
        - Start datetime is in the future.
        - End datetime is after start datetime.
        - Location fields are valid based on location type.
        """
        super().clean()

        validate_start_end_datetime(self.start_datetime, self.end_datetime)
        validate_location_fields(self.location_type, self.venue, self.location)

    def __str__(self):
        return self.title
