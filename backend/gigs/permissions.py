from rest_framework.permissions import BasePermission


class IsGigOwner(BasePermission):
    """
    Custom permission to only allow the owner of a gig to access certain views.
    """

    message = "You do not have permission to perform this action on this gig."

    def has_object_permission(self, request, view, obj):
        return obj.client == request.user


class IsEditableGigStatus(BasePermission):
    """
    Custom permission to only allow updates to gigs with 'draft' or 'published' status.
    """

    message = "This gig cannot be modified because it has already been assigned to an agent, completed, or cancelled."

    def has_object_permission(self, request, view, obj):
        # Only allow updates if the gig is in "draft" or "published" status
        return obj.status in ["draft", "published"]
