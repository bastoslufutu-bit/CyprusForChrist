from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Appointment, PastorAvailability

User = get_user_model()

class PastorAvailabilitySerializer(serializers.ModelSerializer):
    pastor_name = serializers.CharField(source='pastor.get_full_name', read_only=True)
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = PastorAvailability
        fields = ('id', 'pastor', 'pastor_name', 'day_of_week', 'day_display', 
                  'start_time', 'end_time', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
    
    def validate(self, attrs):
        if attrs.get('end_time') and attrs.get('start_time'):
            if attrs['end_time'] <= attrs['start_time']:
                raise serializers.ValidationError({
                    'end_time': "L'heure de fin doit être après l'heure de début"
                })
        return attrs


class AppointmentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.get_full_name', read_only=True)
    member_email = serializers.CharField(source='member.email', read_only=True)
    pastor_name = serializers.CharField(source='pastor.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Appointment
        fields = ('id', 'member', 'member_name', 'member_email', 'pastor', 'pastor_name',
                  'requested_date', 'requested_time', 'status', 'status_display',
                  'subject', 'notes', 'pastor_notes', 'location', 'message_to_member',
                  'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at', 'member')
    
    def create(self, validated_data):
        # Le membre est automatiquement défini à partir de la requête
        validated_data['member'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour que le pasteur mette à jour le statut, les notes et les détails"""
    
    class Meta:
        model = Appointment
        fields = ('status', 'pastor_notes', 'location', 'message_to_member')
