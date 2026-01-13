from django.urls import path
from .views import CreateDonationView, ExecuteDonationView, DonationListView

urlpatterns = [
    path('', DonationListView.as_view(), name='donation_list'),
    path('create/', CreateDonationView.as_view(), name='donation_create'),
    path('execute/', ExecuteDonationView.as_view(), name='donation_execute'),
]
