from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import AdminSermonViewSet

router = DefaultRouter()
router.register(r'sermons', AdminSermonViewSet, basename='admin-sermons')

urlpatterns = [
    path('', include(router.urls)),
]
