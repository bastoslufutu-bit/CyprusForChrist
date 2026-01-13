from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Rhema
from .serializers import RhemaSerializer
from users.permissions import IsPastorOrAdmin

class RhemaViewSet(viewsets.ModelViewSet):
    queryset = Rhema.objects.all()
    serializer_class = RhemaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'today']:
            return [permissions.AllowAny()]
        # Seuls Pasteur et Admin peuvent créer/modifier/supprimer
        return [IsPastorOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(pastor=self.request.user)

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        rhema = Rhema.objects.filter(published_at=today).first()
        
        if not rhema:
            from ai_assistant.services import BiblicalAIService
            ai_data = BiblicalAIService.generate_daily_rhema()
            
            if ai_data:
                try:
                    rhema = Rhema.objects.create(
                        title=ai_data.get('title', 'Rhema du Jour'),
                        content=ai_data.get('content', ''),
                        verse=ai_data.get('verse', ''),
                        meditation=ai_data.get('meditation', ''),
                        published_at=today
                    )
                except Exception as e:
                    print(f"Error saving AI Rhema: {e}")
            
            if not rhema:
                # Fallback to the most recent rhema if AI fails or was already returned
                rhema = Rhema.objects.all().first()
            
        if rhema:
            serializer = self.get_serializer(rhema)
            return Response(serializer.data)
        
        return Response({"detail": "Pas de Rhema disponible."}, status=status.HTTP_404_NOT_FOUND)
