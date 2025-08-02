import factory
from faker import Faker as RealFaker

from django.utils import timezone

from gigs.models import Gig
from users.tests.factories import UserFactory
from core.tests.factories import LocationFactory

real_faker = RealFaker()


class GigFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Gig

    title = factory.Faker("sentence", nb_words=4)
    event_label = factory.Faker(
        "words",
        nb=3,
        ext_word_list=[
            "conference",
            "workshop",
            "meetup",
            "corporate",
            "party",
            "wedding",
        ],
        unique=True,
    )
    description = factory.Faker("paragraph", nb_sentences=5)

    location_type = factory.Iterator(Gig.LOCATION_TYPE_CHOICES, getter=lambda c: c[0])
    venue = factory.LazyAttribute(
        lambda o: (
            real_faker.address() if o.location_type in ["physical", "hybrid"] else ""
        )
    )
    location = factory.LazyAttribute(
        lambda o: (
            LocationFactory() if o.location_type in ["physical", "hybrid"] else None
        )
    )
    start_datetime = factory.Faker(
        "future_datetime", tzinfo=timezone.get_default_timezone()
    )
    end_datetime = factory.LazyAttribute(
        lambda o: o.start_datetime + timezone.timedelta(hours=2)
    )

    compensation = factory.Faker(
        "pydecimal", left_digits=3, right_digits=2, positive=True
    )

    status = factory.Iterator(Gig.STATUS_CHOICES, getter=lambda c: c[0])

    client = factory.SubFactory(UserFactory, default_role="client")
    agent = factory.LazyAttribute(
        lambda o: (
            UserFactory(default_role="agent")
            if o.status in ["agent_confirmed", "completed"]
            else None
        )
    )
