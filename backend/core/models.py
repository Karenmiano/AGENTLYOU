from django.db import models


class Location(models.Model):
    """
    Location model for storing location information.
    """

    city = models.CharField(max_length=255)
    state_province = models.CharField(max_length=255, blank=True, default="")
    country = models.CharField(max_length=255)

    # add a unique constraint to city, state_province, country combo
    class Meta:
        db_table = "locations"
        unique_together = ("city", "state_province", "country")

    def __str__(self):
        return f"{self.city}, {self.state_province}, {self.country}"
