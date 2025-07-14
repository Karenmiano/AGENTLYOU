from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from gigs.serializers import GigSerializer
from core.permissions import IsClient


class GigCreateView(generics.CreateAPIView):
    """
    List all gigs or create a new gig.
    """

    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated, IsClient]
