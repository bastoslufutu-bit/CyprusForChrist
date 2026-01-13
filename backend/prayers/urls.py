from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrayerRequestViewSet

router = DefaultRouter()
router.register(r'', PrayerRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
