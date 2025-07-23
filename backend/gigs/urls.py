from django.urls import path

from gigs.views import GigCreateView, GigUpdateView, PublishGig

urlpatterns = [
    path("new/", GigCreateView.as_view(), name="gig-create"),
    path("<uuid:pk>/edit/", GigUpdateView.as_view(), name="gig-update"),
    path("<uuid:pk>/publish/", PublishGig.as_view(), name="gig-publish"),
]
