from rest_framework.permissions import BasePermission


class IsClient(BasePermission):
    """
    Custom permission to only allow clients to access certain views.
    """

    message = "You must be a client to perform this action."

    def has_permission(self, request, view):
        return request.user.is_client
