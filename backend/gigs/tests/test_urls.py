import uuid

from django.test import SimpleTestCase
from django.urls import reverse, resolve

from gigs.views import GigCreateView, GigUpdateView, PublishGig


class GigUrlsTests(SimpleTestCase):
    def test_gig_create_url(self):
        url = reverse("gig-create")
        self.assertEqual(url, "/api/gigs/new/")
        resolver = resolve(url)
        self.assertEqual(resolver.func.view_class, GigCreateView)

    def test_gig_update_url(self):
        gig_id = uuid.uuid4()
        url = reverse("gig-update", kwargs={"pk": gig_id})
        self.assertEqual(url, f"/api/gigs/{gig_id}/edit/")
        resolver = resolve(url)
        self.assertEqual(resolver.func.view_class, GigUpdateView)

    def test_gig_publish_url(self):
        gig_id = uuid.uuid4()
        url = reverse("gig-publish", kwargs={"pk": gig_id})
        self.assertEqual(url, f"/api/gigs/{gig_id}/publish/")
        resolver = resolve(url)
        self.assertEqual(resolver.func.view_class, PublishGig)
