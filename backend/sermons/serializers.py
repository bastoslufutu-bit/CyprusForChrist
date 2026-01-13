from rest_framework import serializers
from .models import Sermon, SermonComment
from django.contrib.auth import get_user_model

User = get_user_model()

class SermonCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = SermonComment
        fields = ('id', 'sermon', 'user', 'user_name', 'content', 'created_at')
        read_only_fields = ('user',)

class SermonSerializer(serializers.ModelSerializer):
    pastor_name = serializers.ReadOnlyField(source='pastor.username')
    comments = SermonCommentSerializer(many=True, read_only=True)
    thumbnail = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    youtube_id = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = (
            'id', 'title', 'description', 'slug', 'pastor', 'pastor_name', 'category',
            'youtube_url', 'pdf_file', 'cover_image', 'thumbnail', 'date', 'youtube_id',
            'is_published', 'created_at', 'updated_at', 'comments'
        )
        read_only_fields = ('slug', 'pastor', 'created_at', 'updated_at')

    def get_thumbnail(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

    def get_date(self, obj):
        return obj.created_at.strftime('%d %B %Y')

    def get_youtube_id(self, obj):
        if obj.youtube_url:
            # Simple extraction for youtube.com/watch?v= or youtu.be/
            if "v=" in obj.youtube_url:
                return obj.youtube_url.split("v=")[1].split("&")[0]
            elif "youtu.be/" in obj.youtube_url:
                return obj.youtube_url.split("/")[-1]
        return None
