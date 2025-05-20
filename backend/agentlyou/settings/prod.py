from datetime import timedelta

from .base import *

DEBUG = False
ALLOWED_HOSTS = []

# JWT token pair lifetime settings
SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"] = timedelta(minutes=15)
SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"] = timedelta(days=1)
