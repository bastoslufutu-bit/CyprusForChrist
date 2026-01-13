from django.urls import path
from .views import (
    PastorAvailabilityListView,
    PastorAvailabilityDetailView,
    AppointmentListCreateView,
    AppointmentDetailView
)

app_name = 'appointments'

urlpatterns = [
    # Availabilities
    path('availabilities/', PastorAvailabilityListView.as_view(), name='availability-list'),
    path('availabilities/<int:pk>/', PastorAvailabilityDetailView.as_view(), name='availability-detail'),
    
    # Appointments
    path('', AppointmentListCreateView.as_view(), name='appointment-list'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]
