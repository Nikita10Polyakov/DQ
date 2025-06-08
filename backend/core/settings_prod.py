from .settings import *

DEBUG = False

ALLOWED_HOSTS = ['yourdomain.com', 'localhost']

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

CORS_ALLOWED_ORIGINS = [
    "https://yourfrontend.com",
]
