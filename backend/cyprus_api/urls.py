"""
Cyprus For Christ API - URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.http import JsonResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Cyprus For Christ API",
        default_version='v1',
        description="""
        API Backend pour la plateforme spirituelle Cyprus For Christ.
        
        Fonctionnalités:
        - 🔐 Authentification JWT + 2FA
        - 📖 Gestion sermons (PDF + YouTube)
        - 🙏 Requêtes de prière confidentielles
        - 🤖 Assistant IA biblique
        - 💰 Dons PayPal avec reçus
        - 📱 Contact WhatsApp
        - 📊 Dashboard pasteur/admin
        """,
        terms_of_service="https://www.cyprusforchrist.org/terms/",
        contact=openapi.Contact(email="contact@cyprusforchrist.org"),
        license=openapi.License(name="Proprietary License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Root redirection
    path('', RedirectView.as_view(url='swagger/', permanent=False)),
    
    # Health Check
    path('health/', lambda r: JsonResponse({'status': 'ok', 'message': 'Cyprus For Christ API is running'})),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    
    # API Root
    path('api/', lambda r: JsonResponse({
        'message': 'Cyprus For Christ API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'sermons': '/api/sermons/',
            'prayers': '/api/prayers/',
            'ai': '/api/ai/',
            'rhema': '/api/rhema/',
            'donations': '/api/donations/',
            'contact': '/api/contact/',
            'about': '/api/about/',
            'dashboard': '/api/dashboard/',
            'appointments': '/api/appointments/',
            'admin': '/api/admin/',
        },
        'documentation': '/swagger/',
    })),
    
    # API v1 Endpoints
    path('api/auth/', include('users.urls')),
    path('api/sermons/', include('sermons.urls')),
    path('api/prayers/', include('prayers.urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/rhema/', include('rhema.urls')),
    path('api/donations/', include('donations.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/about/', include('about.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/admin/', include('users.admin_urls')),
    path('api/admin/', include('sermons.admin_urls')),
    path('api/admin/', include('prayers.admin_urls')),
    path('api/admin/', include('donations.admin_urls')),
    path('api/admin/', include('about.admin_urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = "Cyprus For Christ - Administration"
admin.site.site_title = "Cyprus For Christ Admin"
admin.site.index_title = "Bienvenue dans l'administration Cyprus For Christ"
