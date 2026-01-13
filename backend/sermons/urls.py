from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SermonViewSet

router = DefaultRouter()
router.register(r'', SermonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
