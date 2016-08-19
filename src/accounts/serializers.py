from rest_framework import serializers

from accounts.models import User
from lib.utils import validate_email as email_is_valid
from django.conf import settings
import requests


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        # Send email to user here
        domain = settings.DOMAIN + "/confirm/email/" + str(user.activation_key)

        email_text = "Confirm your account on GNDAPTs: " +\
            "<br/><br/>" +\
            "<a href='" + domain + "'/>Confirm account</a>"

        url = "https://api.mailgun.net/v3/" +\
            settings.MAILGUN_DOMAIN + "/messages"

        files = {
            'from': 'gndapts@mail.gndapts.com',
            'to': user.email,
            'subject': "Confirm your account on GNDAPTs",
            'html': email_text
            }

        r = requests.post(url, auth=('api', settings.MAILGUN_API_KEY), data=files)

        return user

    def validate_email(self, value):
        """
        Validate if email is valid or there is an user using the email.

        :param value: string
        :return: string
        """

        if not email_is_valid(value):
            raise serializers.ValidationError(
                    'Please use a different email address provider.')

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'Email already in use, please use a different email address.')

        return value
