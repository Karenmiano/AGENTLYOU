from django.test import SimpleTestCase
from django.urls import reverse, resolve
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from authentication.views import RegisterUserView, LogoutView


class TestAuthenticationUrls(SimpleTestCase):
    """
    Test the URLs for authentication views.
    """

    def test_register_url(self):
        url = reverse("register")
        self.assertEqual(url, "/api/auth/register/")
        resolver = resolve(url)
        self.assertEqual(resolver.func.view_class, RegisterUserView)

    def test_login_url(self):
        url = reverse("login")
        self.assertEqual(url, "/api/auth/login/")
        resolver = resolve(url)
        self.assertEqual(resolver.func.view_class, TokenObtainPairView)

    def test_logout_url(self):
        url = reverse("logout")
        self.assertEqual(url, "/api/auth/logout/")
        resolver = resolve(url)
        self.assertEqual(resolver.func.view_class, LogoutView)

    def test_refresh_url(self):
        url = reverse("refresh")
        self.assertEqual(url, "/api/auth/refresh/")
        resolver = resolve(url)
        self.assertEqual(resolver.func.view_class, TokenRefreshView)
