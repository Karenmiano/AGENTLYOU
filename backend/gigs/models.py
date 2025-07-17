import uuid

from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator
from django.db import models
from taggit.managers import TaggableManager
from taggit.models import GenericUUIDTaggedItemBase, TaggedItemBase

from gigs.validators import (
    validate_client,
    validate_agent,
)


class UUIDTaggedItem(GenericUUIDTaggedItemBase, TaggedItemBase):
    """
    Custom Through model that uses UUIDs for object IDs
    """

    pass


class GigManager(models.Manager):
    """
    Custom manager for Gig model.
    """

    def create(self, **kwargs):
        """
        Custom method to ensure proper validation during gig creation.
        Ensures that the gig is created with a valid status(draft/published) and no agent assigned.
        """
        # Ensure initial status is either only 'draft' or 'published'
        status = kwargs.get("status")
        if status not in ["draft", "published"]:
            raise ValidationError(
                {
                    "status": "New gigs can only be created with 'draft' or 'published' status"
                }
            )

        # Ensure agent is not assigned during gig creation
        agent = kwargs.get("agent")
        if agent is not None:
            raise ValidationError(
                {"agent": "Agent cannot be assigned during gig creation"}
            )

        return super().create(**kwargs)


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
        validators=[MinLengthValidator(50, "Must be atleast 50 characters long.")]
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

    compensation = models.DecimalField(max_digits=19, decimal_places=4)

    status = models.CharField(
        max_length=255,
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
        validators=[validate_agent],
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = GigManager()

    class Meta:
        db_table = "gigs"

    def __str__(self):
        return self.title
