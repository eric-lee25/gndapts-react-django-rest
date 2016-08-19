from django_rest_logger import log
from rest_framework import status, parsers, renderers
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework_jwt.utils import jwt_response_payload_handler
from django.core.exceptions import ObjectDoesNotExist

from accounts.models import User
from accounts.serializers import UserRegistrationSerializer
from lib.utils import AtomicMixin
from rest_framework_jwt.settings import api_settings


class UserRegisterView(AtomicMixin, CreateModelMixin, GenericAPIView):
    serializer_class = UserRegistrationSerializer
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        return self.create(request)


class UserLoginView(APIView):
    throttle_classes = ()
    permission_classes = ()
    authentication_classes = ()
    parser_classes = (parsers.FormParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = JSONWebTokenSerializer

    def post(self, request):
        """
        User login view.

        Based on JSONWebTokenAPIView from rest_framework_jwt.
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.object.get('user') or request.user
            token = serializer.object.get('token')
            response_data = jwt_response_payload_handler(token, user, request)

            return Response(response_data)

        log.warning(
                message='Authentication failed.',
                details={'http_status_code': status.HTTP_401_UNAUTHORIZED})
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class UserConfirmEmailView(GenericAPIView):
    serializer_class = None
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, activation_key):
        try:
            user = User.objects.get(activation_key=str(activation_key))
        except ObjectDoesNotExist:
            return Response({'message': 'Invalid confirmation code'},
                            status=status.HTTP_404_NOT_FOUND)

        user.confirm_email()

        # Generate JWT from just the user object
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        return Response({'token': jwt_encode_handler(payload)},
                        status=status.HTTP_200_OK)
