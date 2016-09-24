from rest_framework import permissions

class IsOwnerForDeletePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action == "destroy":
            return obj.creator == request.user
        return True
