import dj_database_url

from gndapts.settings.base import *  # NOQA (ignore all errors on this line)

# TODO - CHANGE THIS
MAILGUN_API_KEY = 'key-442e50acc9cba4977bbcdd955bd00db4'
MAILGUN_DOMAIN = 'sandbox6601c4f014a44e0e87c37cc9baef28f1.mailgun.org'

DEBUG = False
TEMPLATE_DEBUG = DEBUG

PAGE_CACHE_SECONDS = 60

# MAILGUN_API_KEY = os.environ['MAILGUN_API_KEY']
# MAILGUN_DOMAIN = os.environ['MAILGUN_DOMAIN']

# TODO: n a real production server this should have a proper url
ALLOWED_HOSTS = ['*']

DATABASES = {}
DATABASES['default'] = dj_database_url.config()

REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)

WSGI_APPLICATION = 'gndapts.wsgi.application'

DOMAIN = "http://gndapts.herokuapp.com"

# Note turned off sentry. We're going to use the default debugging

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'DEBUG',
        'handlers': ['django_rest_logger_handler'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'django_rest_logger_handler': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
        'django_rest_logger': {
            'level': 'DEBUG',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
    },
}

DEFAULT_LOGGER = 'django_rest_logger'

LOGGER_EXCEPTION = DEFAULT_LOGGER
LOGGER_ERROR = DEFAULT_LOGGER
LOGGER_WARNING = DEFAULT_LOGGER
