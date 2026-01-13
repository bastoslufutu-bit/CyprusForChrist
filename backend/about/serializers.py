from rest_framework import serializers
from .models import InformationSection, Event, GalleryItem, Visionary

class InformationSectionSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = InformationSection
        fields = ('id', 'type', 'type_display', 'title', 'content', 'image', 'updated_at')

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'date', 'time', 'location', 'category', 'image', 'is_annual', 'is_past', 'is_pinned', 'created_at')

class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = ('id', 'title', 'image', 'caption', 'created_at')

class VisionarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Visionary
        fields = (
            'id', 'name', 'title', 'biography', 'history', 'photo',
            'instagram', 'facebook', 'twitter', 'youtube',
            'is_active', 'created_at', 'updated_at'
        )
