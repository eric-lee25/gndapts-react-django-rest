import os
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


class IndexView(View):
    def get(self, request):
        abspath = open(os.path.join(
            settings.BASE_DIR, 'static_dist/index.html'), 'r')
        return HttpResponse(content=abspath.read())


class ProtectedDataView(GenericAPIView):

    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request):
        """Process GET request and return protected data."""

        data = {
            'data': 'THIS IS THE PROTECTED STRING FROM SERVER',
        }

        return Response(data, status=status.HTTP_200_OK)
