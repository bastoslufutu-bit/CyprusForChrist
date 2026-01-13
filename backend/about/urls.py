from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InformationSectionViewSet, EventViewSet, GalleryViewSet, VisionaryViewSet

router = DefaultRouter()
router.register(r'sections', InformationSectionViewSet)
router.register(r'events', EventViewSet)
router.register(r'gallery', GalleryViewSet)
router.register(r'visionaries', VisionaryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
