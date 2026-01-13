from rest_framework import viewsets
from prayers.models import PrayerRequest
from prayers.serializers import PrayerRequestSerializer
from django.db.models import Q
from users.permissions import IsAdmin

class AdminPrayerViewSet(viewsets.ModelViewSet):
    """ViewSet for admin prayer management"""
    queryset = PrayerRequest.objects.all().order_by('-created_at')
    serializer_class = PrayerRequestSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search filter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(user__first_name__icontains=search)
            )
        
        # Status filter
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
