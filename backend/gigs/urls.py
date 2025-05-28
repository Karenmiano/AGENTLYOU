from django.urls import path

from .views import GigListCreateView

urlpatterns = [
    path("", GigListCreateView.as_view(), name="gig-list-create"),
]
