from rest_framework import serializers
from base.models import Building, Unit, Review, User
from django.db.models import Min, Max


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = (
                'activation_key', 'confirmed_email', 'date_joined',
                'is_active', 'is_staff', 'is_superuser',
                'last_login', 'password', 'email')


class BuildingSerializer(serializers.ModelSerializer):
    photos = serializers.JSONField(required=False, allow_null=True)
    creator = serializers.UUIDField(required=False)
    unit_summary = serializers.SerializerMethodField()

    def get_unit_summary(self, building):
        qs = building.unit_set
        agg = qs.aggregate(
                Max('rent'), Min('rent'), Min('num_beds'), Max('num_beds'))
        agg['lease_types'] = qs.values_list('type_lease').distinct()
        agg['unit_count'] = qs.count()
        return agg

    class Meta:
        model = Building


class ReviewSerializer(serializers.ModelSerializer):
    creator = serializers.UUIDField(required=False, write_only=True)
    reviewee = serializers.SerializerMethodField()

    def validate_rating(self, value):
        if (1 <= value <= 5) is False:
            raise serializers.ValidationError("This needs to between 1 and 5.")
        return value

    def get_reviewee(self, review):
        if review.anonymous is False:
            return UserSerializer(review.creator).data
        return None

    class Meta:
        model = Review


class UnitSerializer(serializers.ModelSerializer):
    building_data = BuildingSerializer(read_only=True, source='building')
    photos = serializers.JSONField(required=False, allow_null=True)
    creator = serializers.UUIDField(required=False)
    building_reviews = serializers.SerializerMethodField()

    def get_building_reviews(self, unit):
        return ReviewSerializer(unit.building.review_set,many=True).data

    class Meta:
        model = Unit


class FullBuildingSerializer(serializers.ModelSerializer):
    unit_set = UnitSerializer(many=True)
    review_set = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Building
