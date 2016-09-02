from rest_framework import serializers
from base.models import Building, Unit, Review


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


class ReviewSerializer(serializers.ModelSerializer):
    creator = serializers.UUIDField(required=False)

    def validate_rating(self, value):
        if (1 <= value <= 5) is False:
            raise serializers.ValidationError("This needs to between 1 and 5.")
        return value

    class Meta:
        model = Review
