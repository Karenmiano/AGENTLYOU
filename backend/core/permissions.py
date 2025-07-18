from rest_framework.permissions import BasePermission


class IsClient(BasePermission):
    """
    Custom permission to only allow clients to access certain views.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_client
