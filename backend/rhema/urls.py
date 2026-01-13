from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RhemaViewSet

router = DefaultRouter()
router.register(r'', RhemaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
