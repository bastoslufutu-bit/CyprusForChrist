from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import AdminDonationViewSet

router = DefaultRouter()
router.register(r'donations', AdminDonationViewSet, basename='admin-donations')

urlpatterns = [
    path('', include(router.urls)),
]
