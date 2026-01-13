from rest_framework import serializers
from .models import AIConsultation

class AIConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIConsultation
        fields = ('id', 'user', 'question', 'answer', 'created_at')
        read_only_fields = ('user', 'answer', 'created_at')
