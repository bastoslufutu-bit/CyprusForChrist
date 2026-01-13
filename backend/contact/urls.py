from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactRequestViewSet, ContactInfoView

router = DefaultRouter()
router.register(r'messages', ContactRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('info/', ContactInfoView.as_view(), name='contact_info'),
]
