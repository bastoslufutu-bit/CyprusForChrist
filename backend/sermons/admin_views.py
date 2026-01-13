from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from sermons.models import Sermon
from sermons.serializers import SermonSerializer
from users.permissions import IsAdmin
from django.db.models import Q

class AdminSermonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for admin sermon management
    """
    queryset = Sermon.objects.all().order_by('-created_at')
    serializer_class = SermonSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search filter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(pastor__first_name__icontains=search) |
                Q(pastor__last_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Category filter
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a sermon"""
        sermon = self.get_object()
        sermon.pk = None
        sermon.title = f"{sermon.title} (Copie)"
        sermon.save()
        
        return Response({
            'message': 'Sermon dupliqué avec succès',
            'sermon': SermonSerializer(sermon).data
        })

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title')
        from django.utils.text import slugify
        slug = slugify(title)
        
        # Ensure slug uniqueness
        original_slug = slug
        counter = 1
        while Sermon.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
            
        serializer.save(pastor=self.request.user, slug=slug)
