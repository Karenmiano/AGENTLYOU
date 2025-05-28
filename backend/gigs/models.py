import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Gig(models.Model):

    LOCATION_TYPE_CHOICES = [
        ("virtual", "Virtual"),
        ("physical", "Physical"),
        ("hybrid", "Hybrid"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("receiving_applications", "Receiving Applications"),
        ("agent_confirmed", "Agent Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    # gig details
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    event_type = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField()

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

    compensation = models.DecimalField(max_digits=10, decimal_places=2)
    expenses = models.JSONField(blank=True, default=list)

    status = models.CharField(
        max_length=255,
        choices=STATUS_CHOICES,
        default="draft",
    )

    client = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.CASCADE,
        related_name="gigs",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gigs"

    def clean(self):
        super().clean()

        if self.end_datetime <= self.start_datetime:
            raise ValidationError(
                {
                    "end_datetime": "End date and time must be greater than start date and time.",
                }
            )

        if self.start_datetime < timezone.now():
            raise ValidationError(
                {"start_datetime": "Start date and time must be in the future."}
            )

        if self.location_type in ["physical", "hybrid"]:
            if not self.venue:
                raise ValidationError(
                    {"venue": "Venue is required for physical and hybrid gigs."}
                )

            if not self.location:
                raise ValidationError(
                    {"location": "Location is required for physical and hybrid gigs."}
                )

    def __str__(self):
        return self.title
