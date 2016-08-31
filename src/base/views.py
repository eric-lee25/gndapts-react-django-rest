import os
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from base.models import Building, Unit
from base.serializers import BuildingSerializer, UnitSerializer
from rest_framework import viewsets, mixins


class IndexView(View):
    def get(self, request):
        abspath = open(os.path.join(
            settings.BASE_DIR, 'static_dist/index.html'), 'r')
        return HttpResponse(content=abspath.read())


class BuildingViewset(
        mixins.CreateModelMixin,
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    serializer_class = BuildingSerializer

    def get_queryset(self):
        try:
            rent = self.request.query_params.get('rent')
            num_beds = self.request.query_params.get('num_beds')
            num_baths = self.request.query_params.get('num_baths')
            building_ids = Unit.objects.all().\
                filter(rent__lte=rent, num_beds__gte=num_beds,
                       num_baths__gte=num_baths).\
                values_list('building', flat=True)
            queryset = Building.objects.all().filter(pk__in=building_ids)
            return queryset
        # If no  or bad params, return everything
        except ValueError:
            return Building.objects.all()

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class UnitViewset(
        mixins.CreateModelMixin,
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class ProtectedDataView(GenericAPIView):
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request):
        """Process GET request and return protected data."""

        data = {
            'data': 'THIS IS THE PROTECTED STRING FROM SERVER',
        }

        return Response(data, status=status.HTTP_200_OK)
