from django.urls import path
from .views import DashboardStatsView, DashboardChartsView, RecentActivityView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('charts/', DashboardChartsView.as_view(), name='dashboard-charts'),
    path('activity/', RecentActivityView.as_view(), name='dashboard-activity'),
]
