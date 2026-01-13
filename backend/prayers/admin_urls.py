from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import AdminPrayerViewSet

router = DefaultRouter()
router.register(r'prayers', AdminPrayerViewSet, basename='admin-prayers')

urlpatterns = [
    path('', include(router.urls)),
]
