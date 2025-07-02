from datetime import timedelta

from .base import *

DEBUG = True
ALLOWED_HOSTS = []

# JWT token pair lifetime settings
SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"] = timedelta(hours=3)
SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"] = timedelta(days=1)
