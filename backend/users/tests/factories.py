import factory

from django.contrib.auth import get_user_model

from core.tests.factories import LocationFactory

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker("email")
    full_name = factory.Faker("name")
    password = factory.Faker("password", length=12)
    location = factory.SubFactory(LocationFactory)

    default_role = factory.Iterator(User.DEFAULT_ROLE_CHOICES, getter=lambda c: c[0])
    is_client = factory.LazyAttribute(lambda o: o.default_role == "client")
    is_agent = factory.LazyAttribute(lambda o: o.default_role == "agent")
