# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('password', models.CharField(verbose_name='password', max_length=128)),
                ('last_login', models.DateTimeField(verbose_name='last login', null=True, blank=True)),
                ('user_uuid', models.UUIDField(editable=False, unique=True, default=uuid.uuid4)),
                ('first_name', models.CharField(verbose_name='First Name', max_length=50)),
                ('last_name', models.CharField(verbose_name='Last Name', max_length=50)),
                ('email', models.EmailField(verbose_name='Email address', max_length=254, unique=True)),
                ('confirmed_email', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(verbose_name='staff status', default=False)),
                ('is_superuser', models.BooleanField(verbose_name='superuser status', default=False)),
                ('is_active', models.BooleanField(verbose_name='active', default=True)),
                ('date_joined', models.DateTimeField(verbose_name='date joined', auto_now_add=True)),
                ('activation_key', models.UUIDField(unique=True, default=uuid.uuid4)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
