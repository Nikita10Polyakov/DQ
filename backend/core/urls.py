from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from story.views import StoryArcViewSet

router = DefaultRouter()
router.register(r'story-arcs', StoryArcViewSet, basename='storyarc')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/', include(router.urls)),  
]
