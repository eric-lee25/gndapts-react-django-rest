from rest_framework import serializers
from base.models import Building, Unit


class BuildingSerializer(serializers.ModelSerializer):
    photos = serializers.JSONField(required=False, allow_null=True)
    creator = serializers.UUIDField(required=False)

    class Meta:
        model = Building


class UnitSerializer(serializers.ModelSerializer):
    photos = serializers.JSONField(required=False, allow_null=True)
    creator = serializers.UUIDField(required=False)

    class Meta:
        model = Unit
