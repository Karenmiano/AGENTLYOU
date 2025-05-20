from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Gig
from .serializers import GigSerializer


class GigListCreateView(generics.ListCreateAPIView):
    """
    List all gigs or create a new gig.
    """

    queryset = Gig.objects.all()
    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated]


class GigRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a gig instance.
    """

    queryset = Gig.objects.all()
    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated]
