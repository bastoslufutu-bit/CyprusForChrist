from django.contrib import admin
from .models import Rhema

@admin.register(Rhema)
class RhemaAdmin(admin.ModelAdmin):
    list_display = ('title', 'pastor', 'published_at', 'created_at')
    list_filter = ('published_at', 'pastor')
    search_fields = ('title', 'content', 'verse')
    date_hierarchy = 'published_at'
    
    def save_model(self, request, obj, form, change):
        if not obj.pastor_id:
            obj.pastor = request.user
        super().save_model(request, obj, form, change)
