from django.contrib import admin
from .models import AIConsultation

@admin.register(AIConsultation)
class AIConsultationAdmin(admin.ModelAdmin):
    list_display = ('question_short', 'user', 'created_at')
    list_filter = ('created_at', 'user')
    readonly_fields = ('user', 'question', 'answer', 'created_at')
    
    def question_short(self, obj):
        return (obj.question[:75] + '..') if len(obj.question) > 75 else obj.question
    question_short.short_description = 'Question'

    # Disable adding/editing history manually to preserve integrity
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
