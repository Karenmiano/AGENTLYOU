import os
from dotenv import load_dotenv

load_dotenv()

env = os.getenv("ENV")

if env == "development":
    from .dev import *
elif env == "production":
    from .prod import *
