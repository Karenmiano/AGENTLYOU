from django.urls import path

from gigs.views import GigCreateView

urlpatterns = [
    path("create/", GigCreateView.as_view(), name="gig-create"),
]
