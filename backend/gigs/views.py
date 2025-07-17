from rest_framework import generics, status
from rest_framework.response import Response

from gigs.serializers import GigSerializer
from core.permissions import IsClient


class GigCreateView(generics.CreateAPIView):
    """
    Create a new gig.
    """

    serializer_class = GigSerializer
    permission_classes = [IsClient]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # set the client to the current user
        data["client"] = request.user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_201_CREATED)
