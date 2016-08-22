import uuid

from django.db import models
from django.contrib.postgres.fields import JSONField
from accounts.models import User


class Building(models.Model):
    building_uuid = models.UUIDField(
            unique=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=128)
    type_lease = models.CharField(max_length=64)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    photos = JSONField()
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)


class Unit(models.Model):
    unit_uuid = models.UUIDField(
            unique=True, default=uuid.uuid4, editable=False)
    building = models.ForeignKey(Building)
    number = models.PositiveIntegerField()
    num_beds = models.PositiveIntegerField()
    num_baths = models.PositiveIntegerField()
    title = models.CharField(max_length=128)
    amenities = models.TextField()
    description = models.TextField()
    rent = models.PositiveIntegerField()
    security_deposit = models.PositiveIntegerField()
    photos = JSONField()
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)
