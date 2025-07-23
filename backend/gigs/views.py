from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from gigs.models import Gig
from gigs.serializers import GigSerializer
from gigs.permissions import IsGigOwner, IsEditableGigStatus
from core.permissions import IsClient


class GigCreateView(generics.CreateAPIView):
    """
    Create a new gig.

    Only clients can create gigs.
    """

    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def perform_create(self, serializer):
        """
        Overriding perform_create to save the gig with the client as the current user.
        """
        serializer.save(client=self.request.user)


class GigUpdateView(generics.UpdateAPIView):
    """
    Update an existing gig.
    Clients can update their gigs if they are in 'draft' or 'published' status, otherwise
    they cannot modify the gig.
    Status updates cannot be done directly through this endpoint.
    """

    queryset = Gig.objects.all()
    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated, IsClient, IsGigOwner, IsEditableGigStatus]
    http_method_names = ["put"]


class PublishGig(APIView):
    """
    Move gig from draft to published.
    Only draft gigs can be published.
    """

    permission_classes = [IsAuthenticated, IsClient, IsGigOwner]

    def get_object(self):
        obj = generics.get_object_or_404(Gig, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, pk, format=None):
        gig = self.get_object()

        try:
            gig.publish()
        except DjangoValidationError as e:
            return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Gig published successfully."})
