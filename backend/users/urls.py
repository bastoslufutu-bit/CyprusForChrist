from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, ProfileView, Enable2FAView, Verify2FAView, CreatePastorView, ChangePasswordView, PastorListView, PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
    path('2fa/enable/', Enable2FAView.as_view(), name='enable_2fa'),
    path('2fa/verify/', Verify2FAView.as_view(), name='verify_2fa'),
    path('create-pastor/', CreatePastorView.as_view(), name='create_pastor'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('pastors/', PastorListView.as_view(), name='pastor_list'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
