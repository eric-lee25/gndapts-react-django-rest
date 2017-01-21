from rest_framework import permissions


class IsOwnerForEditOrDeletePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action == "destroy" or view.action == "update":
            return obj.creator == request.user or request.user.is_staff == True
        return True
