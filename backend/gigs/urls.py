from django.urls import path

from gigs.views import GigCreateView, GigClientReviewView, GigUpdateView, PublishGig

urlpatterns = [
    path("new/", GigCreateView.as_view(), name="gig-create"),
    path("<uuid:pk>/review/", GigClientReviewView.as_view(), name="gig-client-review"),
    path("<uuid:pk>/edit/", GigUpdateView.as_view(), name="gig-update"),
    path("<uuid:pk>/publish/", PublishGig.as_view(), name="gig-publish"),
]
