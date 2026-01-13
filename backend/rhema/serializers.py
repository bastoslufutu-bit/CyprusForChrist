from rest_framework import serializers
from .models import Rhema

class RhemaSerializer(serializers.ModelSerializer):
    pastor_name = serializers.ReadOnlyField(source='pastor.username')

    class Meta:
        model = Rhema
        fields = ('id', 'title', 'content', 'verse', 'meditation', 'pastor', 'pastor_name', 'published_at', 'created_at')
        read_only_fields = ('pastor', 'created_at')
