from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from gigs.tests.factories import GigFactory
from gigs.models import Gig
from gigs.serializers import GigSerializer
from users.tests.factories import UserFactory


class GigCreateViewTests(APITestCase):
    def setUp(self):
        self.url = reverse("gig-create")
        self.client_user = UserFactory(default_role="client")
        self.agent_user = UserFactory(default_role="agent")

        self.valid_gig_data = {
            "title": "Test Gig",
            "description": "This is a detailed description with sufficient length for validation.",
            "event_label": ["conference", "workshop"],
            "location_type": "virtual",
            "start_datetime": (timezone.now() + timezone.timedelta(days=1)).isoformat(),
            "end_datetime": (
                timezone.now() + timezone.timedelta(days=1, hours=2)
            ).isoformat(),
            "compensation": "150.00",
            "status": "draft",
        }

    def test_create_gig_success(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.post(self.url, self.valid_gig_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Gig.objects.count(), 1)

        # verify client was assigned correctly
        gig = Gig.objects.first()
        self.assertEqual(gig.client, self.client_user)

    def test_authentication_required(self):
        response = self.client.post(self.url, self.valid_gig_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_only_client_users_can_create_gigs(self):
        self.client.force_authenticate(user=self.agent_user)
        response = self.client.post(self.url, self.valid_gig_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"], "You must be a client to perform this action."
        )

    def test_error_returned_for_invalid_data(self):
        invalid_data_description = {
            **self.valid_gig_data,
            "description": "Less than fifty chars",
        }

        self.client.force_authenticate(user=self.client_user)
        response = self.client.post(self.url, invalid_data_description)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["description"][0], "Must be at least 50 characters long"
        )


class GigClientReviewViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client_user = UserFactory(default_role="client")
        cls.gig = GigFactory(
            title="Test Gig Title", status="draft", client=cls.client_user
        )

    def setUp(self):
        self.url = reverse("gig-client-review", kwargs={"pk": self.gig.id})

    def test_get_gig_review_success(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("id", response.data)
        self.assertIn("description", response.data)
        self.assertIn("status", response.data)

    def test_only_authenticated_users_can_access_view(self):
        # remove credentials
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_only_client_users_can_access_view(self):
        agent_user = UserFactory(default_role="agent")
        self.client.force_authenticate(user=agent_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "You must be a client to perform this action.",
        )

    def test_client_must_be_gig_owner_to_retrieve(self):
        another_client = UserFactory(default_role="client")
        self.client.force_authenticate(user=another_client)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "You do not have permission to perform this action on this gig",
        )


class GigUpdateViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client_user = UserFactory(default_role="client")
        cls.gig = GigFactory(
            title="Test Gig Title", status="draft", client=cls.client_user
        )
        cls.gig_data = GigSerializer(cls.gig).data

    def setUp(self):
        self.url = reverse("gig-update", kwargs={"pk": self.gig.id})
        self.client.force_authenticate(user=self.client_user)

    def test_put_update_gig_success(self):
        updated_gig = {
            **self.gig_data,
            "title": "Updated Gig Title",
        }
        response = self.client.put(self.url, updated_gig)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Gig Title")

    def test_patch_update_not_allowed(self):
        response = self.client.patch(
            self.url,
            {
                "title": "Updated Gig Title",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_direct_status_updates_are_ignored(self):
        # try to publish the gig directly through the update view
        response = self.client.put(
            self.url,
            {
                **self.gig_data,
                "status": "published",
            },
        )

        # No error response is returned but status is not changed
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "draft")

        # try to set status to "completed" through the update view
        response = self.client.put(self.url, {**self.gig_data, "status": "completed"})

        # No error response is returned but status is not changed
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "draft")

    def test_only_draft_and_published_gigs_can_be_updated(self):
        # Attempt to update gig with status 'draft'
        response = self.client.put(
            self.url,
            {
                **self.gig_data,
                "title": "Update a draft gig",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Update a draft gig")

        # Publish gig and try again
        self.gig.publish()
        published_gig_data = GigSerializer(self.gig).data
        response = self.client.put(
            self.url,
            {
                **published_gig_data,
                "title": "Update a published gig",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Update a published gig")

        # Set gig status to 'agent_confirmed' and try again
        self.gig.status = "agent_confirmed"
        self.gig.save()
        confirmed_gig_data = GigSerializer(self.gig).data
        response = self.client.put(
            self.url,
            {
                **confirmed_gig_data,
                "title": "Should Not Update",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "This gig cannot be modified because it has already been assigned to an agent, completed, or cancelled",
        )

    def test_only_authenticated_users_can_access_view(self):
        # remove credentials
        self.client.force_authenticate(user=None)

        updated_gig = {
            **self.gig_data,
            "title": "Updated Gig Title",
        }
        response = self.client.put(self.url, updated_gig)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_only_client_users_can_access_view(self):
        agent_user = UserFactory(default_role="agent")
        self.client.force_authenticate(user=agent_user)

        updated_gig = {
            **self.gig_data,
            "title": "Updated Gig Title",
        }
        response = self.client.put(self.url, updated_gig)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "You must be a client to perform this action.",
        )

    def test_client_must_be_gig_owner_to_update(self):
        another_client = UserFactory(default_role="client")
        self.client.force_authenticate(user=another_client)

        updated_gig = {
            **self.gig_data,
            "title": "Updated Gig Title",
        }
        response = self.client.put(self.url, updated_gig)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "You do not have permission to perform this action on this gig",
        )


class PublishGigViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client_user = UserFactory(default_role="client")
        cls.gig = GigFactory(client=cls.client_user, status="draft")

    def setUp(self):
        self.url = reverse("gig-publish", kwargs={"pk": self.gig.id})
        self.client.force_authenticate(user=self.client_user)

    def test_publish_draft_gig_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.gig.refresh_from_db()
        self.assertEqual(self.gig.status, "published")

    def test_only_draft_gigs_can_be_published(self):
        # publish gig
        self.gig.publish()

        # attempt publish request on gig
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["status"][0], "Only gigs with status 'draft' can be published"
        )

        # change status to cancelled and attempt to publish
        self.gig.status = "cancelled"
        self.gig.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["status"][0], "Only gigs with status 'draft' can be published"
        )

    def test_authentication_required(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_only_client_users_can_access(self):
        agent_user = UserFactory(default_role="agent")
        self.client.force_authenticate(user=agent_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "You must be a client to perform this action.",
        )

    def test_client_must_be_gig_owner_to_publish(self):
        another_client = UserFactory(default_role="client")
        self.client.force_authenticate(user=another_client)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "You do not have permission to perform this action on this gig",
        )
