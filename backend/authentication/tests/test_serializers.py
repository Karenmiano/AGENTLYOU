from authentication.serializers import CustomTokenObtainPairSerializer
from django.test import TestCase
from users.models import CustomUser


class TestCustomTokenObtainPairSerializer(TestCase):
    """
    Test the CustomTokenObtainPairSerializer.
    Test the custom claims are correctly added to the token:
     - default_role
     - is_client
     - is_agent
    """

    def test_custom_fields_in_token(self):
        user_data = {
            "email": "test@test.com",
            "password": "testpassword",
            "first_name": "First",
            "last_name": "User",
            "city": "Test City",
            "country": "Test Country",
            "default_role": "client",
            "is_client": True,
            "is_agent": False,
        }
        user = CustomUser.objects.create_user(**user_data)
        token = CustomTokenObtainPairSerializer.get_token(user)
        self.assertEqual(token["default_role"], user.default_role)
        self.assertEqual(token["is_client"], user.is_client)
        self.assertEqual(token["is_agent"], user.is_agent)
