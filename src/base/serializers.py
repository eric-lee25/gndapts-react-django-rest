from rest_framework import serializers
from base.models import Building, Unit, Review
from django.db.models import Min, Max


class BuildingSerializer(serializers.ModelSerializer):
    photos = serializers.JSONField(required=False, allow_null=True)
    creator = serializers.UUIDField(required=False)
    unit_summary = serializers.SerializerMethodField()

    def get_unit_summary(self, building):
        qs = building.unit_set
        agg = qs.aggregate(
                Max('rent'), Min('rent'), Min('num_beds'), Max('num_beds'))
        agg['lease_types'] = qs.values_list('type_lease').distinct()
        return agg

    class Meta:
        model = Building


class UnitSerializer(serializers.ModelSerializer):
    building_data = BuildingSerializer(read_only=True, source='building')
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
