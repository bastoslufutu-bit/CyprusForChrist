from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import PrayerRequest
from .serializers import PrayerRequestSerializer
from users.permissions import IsPastorOrAdmin

class PrayerRequestViewSet(viewsets.ModelViewSet):
    queryset = PrayerRequest.objects.all()
    serializer_class = PrayerRequestSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action == 'create':
            # Tout le monde (y compris les invités) peut créer des requêtes
            return [permissions.AllowAny()]
        elif self.action in ['list', 'retrieve']:
            # Authentifié pour voir (filtré par get_queryset)
            return [permissions.IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Seuls pasteur et admin peuvent modifier/supprimer
            return [IsPastorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # L'utilisateur est associé s'il est connecté, sinon c'est une requête "invité"
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save(user=None)

    def get_queryset(self):
        user = self.request.user
        
        # Pasteur et Admin voient toutes les prières
        if user.role in ['PASTOR', 'ADMIN'] or user.is_superuser:
            return PrayerRequest.objects.all()
        # Membres voient uniquement leurs propres prières
        else:
            return PrayerRequest.objects.filter(user=user)
