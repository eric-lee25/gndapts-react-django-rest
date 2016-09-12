import os
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View
from base.models import Building, Unit, Review
from base.serializers import BuildingSerializer,\
        UnitSerializer, ReviewSerializer, FullBuildingSerializer
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

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FullBuildingSerializer
        return BuildingSerializer

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

    # TODO: change this + error proof it
    def get_queryset(self):
        queryset = Unit.objects.filter(creator=self.request.user).\
                order_by('date_created')
        return queryset


class ReviewViewset(
        mixins.CreateModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
