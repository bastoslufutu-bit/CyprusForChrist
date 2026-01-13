from django.contrib import admin
from .models import PrayerRequest

@admin.register(PrayerRequest)
class PrayerRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_author', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'content', 'full_name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_author(self, obj):
        if obj.user:
            return obj.user.username
        return obj.full_name or "Anonyme"
    get_author.short_description = "Auteur"

    def save_model(self, request, obj, form, change):
        # Additional logic if needed when pastor updates status
        super().save_model(request, obj, form, change)
