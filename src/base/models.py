import uuid

from django.db import models
from django.contrib.postgres.fields import JSONField
from accounts.models import User


class Building(models.Model):
    uuid = models.UUIDField(
            unique=True, default=uuid.uuid4, editable=False,
            primary_key=True)
    title = models.CharField(max_length=128)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    photos = JSONField(blank=True, null=True)
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)


class Unit(models.Model):
    uuid = models.UUIDField(
           unique=True, default=uuid.uuid4, editable=False,
           primary_key=True)
    building = models.ForeignKey(Building)
    type_lease = models.CharField(max_length=64)
    number = models.PositiveIntegerField()
    num_beds = models.PositiveIntegerField()
    num_baths = models.PositiveIntegerField()
    title = models.CharField(max_length=128)
    amenities = models.TextField()
    description = models.TextField()
    rent = models.PositiveIntegerField()
    security_deposit = models.PositiveIntegerField()
    photos = JSONField(blank=True, null=True)
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)


class Review(models.Model):
    uuid = models.UUIDField(
           unique=True, default=uuid.uuid4, editable=False,
           primary_key=True)
    building = models.ForeignKey(Building)
    rating = models.PositiveIntegerField()
    comments = models.TextField()
    anonymous = models.BooleanField()
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)
