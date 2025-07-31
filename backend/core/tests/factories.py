import factory

from core.models import Location


class LocationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Location

    city = factory.Faker("city")
    state_region = factory.Faker("state")
    country = factory.Faker("country")
