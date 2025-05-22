import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class CustomUserManager(BaseUserManager):
    """
    Custom User Manager for the CustomUser model.
    """

    def create_user(self, email, password, first_name, last_name, **extra_fields):
        """
        Creates a new user.
        Raises ValueError if email is not provided.
        Normalizes email for case insensitive uniqueness and consistent storage.
        Sets password and saves user.
        """
        if not email:
            raise ValueError("The Email must be provided")

        email = self.normalize_email(email)
        user = self.model(
            email=email, first_name=first_name, last_name=last_name, **extra_fields
        )
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, first_name, last_name, **extra_fields):
        """
        Creates superuser, raises ValueError if is_staff or is_superuser is not True.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email, password, first_name, last_name, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for application.
    """

    DEFAULT_ROLE_CHOICES = [("agent", "Agent"), ("client", "Client")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    # location
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)

    is_client = models.BooleanField(default=False)
    is_agent = models.BooleanField(default=False)
    default_role = models.CharField(
        max_length=20,
        choices=DEFAULT_ROLE_CHOICES,
    )  # default role when signing in, determined at sign up

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        db_table = "users"

    def __str__(self):
        """
        Return email as string representation of the User.
        """
        return self.email
