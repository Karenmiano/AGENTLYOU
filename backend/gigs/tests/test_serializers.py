from django.test import TestCase
from django.utils import timezone

from users.tests.factories import UserFactory
from gigs.models import Gig, Venue
from gigs.serializers import GigSerializer
from core.models import Location


class GigSerializerTests(TestCase):
    def setUp(self):
        self.valid_data = {
            "title": "New Test Gig",
            "description": "This is a detailed description with sufficient length for validation.",
            "event_label": ["conference", "workshop"],
            "status": "draft",
            "location_type": "virtual",
            "timezone": "Africa/Nairobi",
            "start_datetime": (timezone.now() + timezone.timedelta(days=1)).isoformat(),
            "end_datetime": (
                timezone.now() + timezone.timedelta(days=1, hours=2)
            ).isoformat(),
            "compensation": "150.00",
        }

        self.venue = {
            "google_place_id": "ChIJN1t_tDeuEmsRUsoyG83frY4",
            "name": "The Grand Hall",
            "address": "123 Main St, Test City, Test Country",
            "location": {
                "city": "Test City",
                "state_region": "Test State",
                "country": "Test Country",
            },
        }

    def test_valid_data_creates_gig(self):
        serializer = GigSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        client = UserFactory(default_role="client")
        gig = serializer.save(client=client)
        self.assertEqual(Gig.objects.count(), 1)
        self.assertEqual(gig.title, "New Test Gig")

    def test_nested_venue_serializer_is_correctly_linked_during_create_and_update(
        self,
    ):
        """
        Test that venue is correctly retrieved or created and linked to the gig.
        """
        # in creation
        data_with_venue = {
            **self.valid_data,
            "location_type": "physical",
            "venue": self.venue,
        }
        serializer = GigSerializer(data=data_with_venue)
        self.assertTrue(serializer.is_valid())
        client = UserFactory(default_role="client")
        gig = serializer.save(client=client)
        self.assertIsInstance(gig.venue, Venue)
        self.assertIsInstance(gig.venue.location, Location)
        self.assertEqual(gig.venue.name, "The Grand Hall")
        self.assertEqual(gig.venue.location.city, "Test City")

        # in update
        updated_data_with_venue = {
            **data_with_venue,
            "venue": {
                "google_place_id": "Chjds_tDeuEmsRUsoyG83frY4",
                "name": "Updated Grand Hall",
                "address": "Updated 123 Main St, Test City, Test Country",
                "location": {
                    "city": "Test City",
                    "state_region": "Test State",
                    "country": "Test Country",
                },
            },
        }
        serializer = GigSerializer(instance=gig, data=updated_data_with_venue)
        self.assertTrue(serializer.is_valid())
        updated_gig = serializer.save()
        self.assertIsInstance(updated_gig.venue, Venue)
        self.assertIsInstance(gig.venue.location, Location)
        self.assertEqual(updated_gig.venue.name, "Updated Grand Hall")
        self.assertEqual(updated_gig.venue.location.city, "Test City")

    def test_client_field_is_read_only(self):
        """Test that client cannot be set using input data during gig creation or update."""
        serializer = GigSerializer()
        client_field = serializer.fields["client"]

        self.assertTrue(client_field.read_only)

    def test_agent_field_is_read_only(self):
        """Test that agent cannot be set using input data during gig creation or update."""
        serializer = GigSerializer()
        agent_field = serializer.fields["agent"]

        self.assertTrue(agent_field.read_only)

    def test_status_field_read_only_on_update(self):
        """
        Test that status can't updated directly via serializer.
        Status updates are dependent on other fields and code paths,
        hence will be set using model methods to ensure data integrity.
        """
        serializer = GigSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        client = UserFactory(default_role="client")
        gig = serializer.save(client=client)

        # Attempt to update status directly
        updated_status_data = {
            **self.valid_data,
            "status": "published",
        }
        serializer = GigSerializer(instance=gig, data=updated_status_data)
        self.assertTrue(serializer.is_valid())  # should not bring an error
        updated_gig = serializer.save()
        self.assertEqual(updated_gig.status, "draft")  # but status update was ignored

    def test_status_field_can_only_be_draft_or_published_during_create(self):
        # Test with valid status
        published_status_data = {**self.valid_data, "status": "published"}
        serializer = GigSerializer(data=published_status_data)
        self.assertTrue(serializer.is_valid())

        # Test with status 'completed' which is valid for model but not during creation
        completed_status_data = {**self.valid_data, "status": "completed"}
        serializer = GigSerializer(data=completed_status_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("status", serializer.errors)

    def test_start_end_datetime_validation(self):
        """
        Test that start datetime must be in the future and end datetime must be after start datetime.
        """
        # Start datetime in past
        past_start_data = {
            **self.valid_data,
            "start_datetime": (timezone.now() - timezone.timedelta(days=1)).isoformat(),
        }
        serializer = GigSerializer(data=past_start_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("start_datetime", serializer.errors)

        # End datetime before start datetime
        invalid_end_data = {
            **self.valid_data,
            "end_datetime": (timezone.now() - timezone.timedelta(days=5)).isoformat(),
        }
        serializer = GigSerializer(data=invalid_end_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("end_datetime", serializer.errors)

    def test_physical_location_requires_venue(self):
        valid_physical_data = {
            **self.valid_data,
            "location_type": "physical",
            "venue": self.venue,
        }
        serializer = GigSerializer(data=valid_physical_data)
        self.assertTrue(serializer.is_valid())

        # missing venue
        missing_venue_data = {
            **self.valid_data,
            "location_type": "physical",
        }
        serializer = GigSerializer(data=missing_venue_data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors["venue"][0],
            "Venue is required for physical gigs.",
        )

    def test_virtual_location_should_not_have_venue(self):
        # set a venue on virtual gig
        invalid_venue_data = {
            **self.valid_data,
            "venue": self.venue,
        }
        serializer = GigSerializer(data=invalid_venue_data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors["venue"][0],
            "Venue is not appropriate for virtual gigs.",
        )
