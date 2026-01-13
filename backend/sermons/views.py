from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.text import slugify
from .models import Sermon, SermonComment
from .serializers import SermonSerializer, SermonCommentSerializer
from users.permissions import IsAdmin

class SermonViewSet(viewsets.ModelViewSet):
    queryset = Sermon.objects.all()
    serializer_class = SermonSerializer

    def get_queryset(self):
        queryset = Sermon.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Seuls les Admins peuvent créer/modifier/supprimer
            permission_classes = [IsAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Automatically set slug and pastor
        title = serializer.validated_data.get('title')
        slug = slugify(title)
        
        # Ensure slug uniqueness
        original_slug = slug
        counter = 1
        while Sermon.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
            
        serializer.save(pastor=self.request.user, slug=slug)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, pk=None):
        sermon = self.get_object()
        serializer = SermonCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, sermon=sermon)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
