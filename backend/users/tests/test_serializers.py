from core.models import Location
from django.test import TestCase
from users.models import CustomUser
from users.serializers import UserSerializer


class TestUserSerializer(TestCase):
    """
    Tests for the UserSerializer, covering user creation, input validation logic,
    and serialization output.
    """

    def setUp(self):
        """
        Set up common test data for user creation and validation tests.
        """
        self.user_valid_data = {
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123",
            "confirm_password": "password123",
            "location": {
                "city": "Test City",
                "country": "Test Country",
            },
            "default_role": "client",
        }

        self.user_valid_data_agent = {
            **self.user_valid_data,
            "default_role": "agent",
        }

    def test_successful_user_creation_as_client(self):
        """
        Verifies that a user is successfully created with 'client' role
        and associated flags (is_client=True, is_agent=False) are correctly
        derived and set based on the default_role.
        """
        serializer = UserSerializer(data=self.user_valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        self.assertIsInstance(user, CustomUser)
        self.assertEqual(user.email, self.user_valid_data["email"])
        self.assertEqual(user.full_name, self.user_valid_data["full_name"])
        self.assertTrue(user.check_password(self.user_valid_data["password"]))
        self.assertTrue(user.is_client)
        self.assertFalse(user.is_agent)
        self.assertEqual(user.default_role, self.user_valid_data["default_role"])

    def test_successful_user_creation_as_agent(self):
        """
        Verifies that a user is successfully created with 'agent' role
        and associated flags (is_client=False, is_agent=True) are correctly
        derived and set based on the default_role.
        """
        serializer = UserSerializer(data=self.user_valid_data_agent)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        self.assertIsInstance(user, CustomUser)
        self.assertEqual(user.email, self.user_valid_data_agent["email"])
        self.assertTrue(user.is_agent)
        self.assertFalse(user.is_client)
        self.assertEqual(user.default_role, self.user_valid_data_agent["default_role"])

    def test_password_mismatch_validation(self):
        """
        Ensures the serializer raises a validation error if 'password'
        and 'confirm_password' fields do not match.
        """
        data = self.user_valid_data.copy()
        data["confirm_password"] = "wrong_password"
        serializer = UserSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("confirm_password", serializer.errors)
        self.assertEqual(
            serializer.errors["confirm_password"][0], "Passwords do not match."
        )

    def test_is_client_and_is_agent_are_read_only_on_creation(self):
        """
        Tests that 'is_client' and 'is_agent' fields are read-only during user creation.
        Their values should be derived from 'default_role' and not from any 'is_client'
        or 'is_agent' values passed in the input data.
        """
        data = self.user_valid_data.copy()
        data["is_client"] = False
        data["is_agent"] = True

        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        # Values should be based on default_role="client",not the input is_client/is_agent
        self.assertTrue(user.is_client)
        self.assertFalse(user.is_agent)

    def test_serialization_output_with_password_field_is_write_only(self):
        """
        Verifies the output structure of the serializer for an existing user.
        Ensures expected readable fields are present and write-only fields
        like 'password' and 'confirm_password' are excluded.
        """
        location = Location.objects.create(
            city="Output City",
            country="Output Country",
        )
        user = CustomUser.objects.create_user(
            email="serialize@example.com",
            password="password123",
            full_name="Serialize Me",
            location=location,
            default_role="agent",
            is_client=False,
            is_agent=True,
        )

        serializer = UserSerializer(instance=user)
        data = serializer.data

        self.assertIn("id", data)
        self.assertEqual(data["email"], "serialize@example.com")
        self.assertFalse(data["is_client"])
        self.assertTrue(data["is_agent"])
        self.assertEqual(data["default_role"], "agent")

        # Password and confirm password should not be included in the output
        self.assertNotIn("password", data)
        self.assertNotIn("confirm_password", data)
