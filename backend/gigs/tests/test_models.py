from django.test import TestCase
from django.utils import timezone
from django.core.exceptions import ValidationError

from gigs.tests.factories import GigFactory, VenueFactory


class GigModelTests(TestCase):
    def test_str_method_returns_title(self):
        gig = GigFactory(title="Awesome Product Launch")
        self.assertEqual(str(gig), "Awesome Product Launch")

    def test_publish_changes_status_to_published(self):
        gig = GigFactory(status="draft")
        self.assertEqual(gig.status, "draft")

        gig.publish()
        self.assertEqual(gig.status, "published")

    def test_publish_raises_error_if_gig_is_not_draft(self):
        gig = GigFactory(status="published")
        with self.assertRaises(ValidationError):
            gig.publish()

    def test_publish_checks_for_outdated_start_end_datetime(self):
        # raise error if start datetime is outdated
        gig = GigFactory(
            status="draft",
            start_datetime=timezone.now() - timezone.timedelta(days=1),
        )
        with self.assertRaises(ValidationError) as context:
            gig.publish()

        self.assertEqual(
            context.exception.message_dict["start_datetime"][0],
            "Start date and time must be in the future.",
        )

        # raise error if end datetime is before start datetime
        gig = GigFactory(
            start_datetime=timezone.now() + timezone.timedelta(days=1),
            end_datetime=timezone.now(),
        )
        with self.assertRaises(ValidationError) as context:
            gig.full_clean()

        self.assertEqual(
            context.exception.message_dict["end_datetime"][0],
            "End date and time must come after start date and time.",
        )

    def test_clean_validates_start_end_datetime(self):
        # raise error if start datetime in past
        gig = GigFactory(start_datetime=timezone.now() - timezone.timedelta(days=1))
        with self.assertRaises(ValidationError) as context:
            gig.full_clean()

        self.assertEqual(
            context.exception.message_dict["start_datetime"][0],
            "Start date and time must be in the future.",
        )

        # raise error if end datetime is before start datetime
        gig = GigFactory(
            start_datetime=timezone.now() + timezone.timedelta(days=1),
            end_datetime=timezone.now(),
        )
        with self.assertRaises(ValidationError) as context:
            gig.full_clean()

        self.assertEqual(
            context.exception.message_dict["end_datetime"][0],
            "End date and time must come after start date and time.",
        )

    def test_clean_validates_physical_location_fields(self):
        # raise error if venue is missing for physical gigs
        gig = GigFactory(location_type="physical", venue=None)
        with self.assertRaises(ValidationError) as context:
            gig.full_clean()

        self.assertEqual(
            context.exception.message_dict["venue"][0],
            "Venue is required for physical gigs.",
        )

    def test_clean_validates_virtual_location_fields(self):
        # raise error if venue is provided for virtual gigs
        gig = GigFactory(location_type="virtual", venue=VenueFactory())
        with self.assertRaises(ValidationError) as context:
            gig.full_clean()

        self.assertEqual(
            context.exception.message_dict["venue"][0],
            "Venue is not appropriate for virtual gigs.",
        )


class VenueModelTests(TestCase):
    def test_str_method_returns_name(self):
        venue = VenueFactory(name="The Grand Hall")
        self.assertEqual(str(venue), "The Grand Hall")
