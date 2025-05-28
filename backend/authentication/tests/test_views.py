import jwt

from django.urls import reverse
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import CustomUser
from authentication.serializers import CustomTokenObtainPairSerializer
from core.models import Location


class TestRegisterUserView(APITestCase):
    """
    Test the RegisterUserView.
    """

    def setUp(self):
        """
        Set up the test with the url and common user data.
        """
        self.url = reverse("register")
        self.user_data = {
            "email": "test@test.com",
            "password": "testpassword",
            "confirm_password": "testpassword",
            "first_name": "Test",
            "last_name": "User",
            "location": {
                "city": "Test City",
                "country": "Test Country",
            },
            "default_role": "client",
        }

    def test_user_registration_success(self):
        """
        Test the user registration success.
        Check the response status code.
        Check the response data, ensure login with access and refresh
        tokens are returned.
        """
        response = self.client.post(self.url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response_data = response.data

        # check token and custom claims present
        self.assertIn("access", response_data)
        access_token = response_data["access"]
        self.assertTrue(access_token)
        decoded_access = jwt.decode(
            access_token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        self.assertEqual(decoded_access["default_role"], "client")
        self.assertEqual(decoded_access["is_client"], True)
        self.assertEqual(decoded_access["is_agent"], False)

        self.assertIn("refresh", response_data)
        refresh_token = response_data["refresh"]
        self.assertTrue(refresh_token)
        decoded_refresh = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        self.assertEqual(decoded_refresh["default_role"], "client")
        self.assertEqual(decoded_refresh["is_client"], True)
        self.assertEqual(decoded_refresh["is_agent"], False)

        self.assertEqual(CustomUser.objects.count(), 1)

        user = CustomUser.objects.get(email=self.user_data["email"])
        self.assertEqual(user.default_role, "client")
        self.assertTrue(user.is_client)
        self.assertFalse(user.is_agent)

    def test_user_registration_with_existing_email_returns_409(self):
        """
        Test the user registration with an existing email returns a 409
        error instead of 400 as configured.
        """
        location = Location.objects.create(
            city="Test City",
            country="Test Country",
        )
        user1_data = {
            "email": "test@test.com",
            "password": "testpassword",
            "first_name": "First",
            "last_name": "User",
            "location": location,
            "default_role": "client",
            "is_client": True,
            "is_agent": False,
        }
        CustomUser.objects.create_user(**user1_data)

        response = self.client.post(self.url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "User with this email already exists.")
        self.assertEqual(CustomUser.objects.count(), 1)

    def test_user_registration_with_invalid_data_returns_400(self):
        """
        Test the user registration with invalid data returns a 400 error.
        """
        invalid_user_data = self.user_data.copy()
        invalid_user_data.pop("email")
        response = self.client.post(self.url, invalid_user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(CustomUser.objects.count(), 0)


class TestLogoutView(APITestCase):
    """
    Test the LogoutView.
    """

    def setUp(self):
        location = Location.objects.create(
            city="Test City",
            country="Test Country",
        )
        user_data = {
            "email": "test@test.com",
            "password": "testpassword",
            "first_name": "First",
            "last_name": "User",
            "location": location,
            "default_role": "client",
            "is_client": True,
            "is_agent": False,
        }
        self.user = CustomUser.objects.create_user(**user_data)
        self.logout_url = reverse("logout")
        self.refresh_url = reverse("refresh")

    def test_logout_success(self):
        # login user
        refresh = CustomTokenObtainPairSerializer.get_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        # logout user
        response = self.client.post(
            self.logout_url, {"refresh": str(refresh)}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # check refresh token is blacklisted
        attempt_refresh = self.client.post(
            self.refresh_url, {"refresh": str(refresh)}, format="json"
        )
        self.assertEqual(attempt_refresh.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(attempt_refresh.data["detail"], "Token is blacklisted")

    def test_logout_unauthenticated_user_returns_401(self):
        """
        Test the logout view returns a 401 error if the user is not authenticated.
        """
        response = self.client.post(self.logout_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_without_refresh_token_returns_400(self):
        """
        Test the logout view returns a 400 error if the refresh token is not provided.
        """
        refresh = CustomTokenObtainPairSerializer.get_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        response = self.client.post(self.logout_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("refresh", response.data)
        self.assertEqual(str(response.data["refresh"][0]), "This field is required.")

    def test_logout_invalid_refresh_token_returns_400(self):
        """
        Test the logout view returns a 400 error if the refresh token is invalid.
        """
        refresh = CustomTokenObtainPairSerializer.get_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        response = self.client.post(
            self.logout_url, {"refresh": "invalidtoken"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
