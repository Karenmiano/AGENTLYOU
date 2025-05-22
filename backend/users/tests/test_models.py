from django.test import TestCase
from users.models import CustomUser


class TestCustomUserModel(TestCase):
    """
    Tests for CustomUser model.
    """

    def setUp(self):
        """
        Set up common test data for user and superuser creation.
        """
        self.user_data = {
            "email": "test@example.com",
            "password": "testpassword",
            "first_name": "Test",
            "last_name": "User",
            "city": "Test City",
            "country": "Test Country",
            "default_role": "client",
            "is_agent": False,
            "is_client": True,
        }

        self.superuser_data = {
            "email": "superuser@example.com",
            "password": "superpassword",
            "first_name": "Super",
            "last_name": "User",
        }

    def test_create_user_success(self):
        """
        Verifies that the create_user manager method successfully creates a
        standard user with the provided attributes and that default permissions
        (e.g., not staff, not superuser) are set correctly.
        """
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data["email"])
        self.assertTrue(user.check_password(self.user_data["password"]))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser_success(self):
        """
        Verifies that the create_superuser manager method successfully creates
        a superuser with the necessary staff and superuser flags set to True.
        """
        super_user = CustomUser.objects.create_superuser(**self.superuser_data)
        self.assertTrue(super_user.is_staff)
        self.assertTrue(super_user.is_superuser)

    def test_create_user_missing_email_raises_error(self):
        """
        Ensures that attempting to create a user without an email
        address raises a ValueError.
        """
        user_data = self.user_data.copy()
        user_data["email"] = ""
        with self.assertRaises(ValueError) as context:
            CustomUser.objects.create_user(**user_data)
        self.assertEqual(str(context.exception), "The Email must be provided")

    def test_create_user_normalizes_email(self):
        """
        Checks that the email provided during user creation is normalized to lowercase.
        """
        user_data = self.user_data.copy()
        user_data["email"] = "test@EXAMPLE.com"
        user = CustomUser.objects.create_user(**user_data)
        self.assertEqual(user.email, "test@example.com")

    def test_create_superuser_requires_is_staff_and_is_superuser_true(self):
        """
        Validates that the create_superuser method enforces that superusers
        must have is_staff=True and is_superuser=True, else raises a ValueError.
        """
        with self.assertRaises(ValueError) as context:
            CustomUser.objects.create_superuser(is_staff=False, **self.superuser_data)
        self.assertEqual(str(context.exception), "Superuser must have is_staff=True")

        with self.assertRaises(ValueError) as context:
            CustomUser.objects.create_superuser(
                is_superuser=False, **self.superuser_data
            )
        self.assertEqual(
            str(context.exception), "Superuser must have is_superuser=True"
        )

    def test_str_method_returns_email(self):
        """
        Verifies that the __str__ method of the CustomUser model
        correctly returns the user's email.
        """
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(str(user), "test@example.com")
