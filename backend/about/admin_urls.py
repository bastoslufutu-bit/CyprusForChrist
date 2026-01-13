from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import AdminEventViewSet, AdminGalleryViewSet

router = DefaultRouter()
router.register(r'events', AdminEventViewSet, basename='admin-events')
router.register(r'gallery', AdminGalleryViewSet, basename='admin-gallery')

urlpatterns = [
    path('', include(router.urls)),
]
