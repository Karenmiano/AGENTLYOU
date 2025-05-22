import uuid

from django.db import models


class Gig(models.Model):

    LOCATION_TYPE_CHOICES = [
        ("virtual", "Virtual"),
        ("physical", "Physical"),
        ("hybrid", "Hybrid"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    event_type = models.CharField(max_length=255, blank=True, default="")
    location_type = models.CharField(max_length=10, choices=LOCATION_TYPE_CHOICES)
    venue = models.CharField(max_length=255, blank=True, default="")
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    description = models.TextField()
    compensation = models.DecimalField(max_digits=10, decimal_places=2)
    language_preference = models.CharField(
        max_length=255,
        blank=True,
        default="",
    )
    special_requirements = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gigs"

    def __str__(self):
        return self.title
