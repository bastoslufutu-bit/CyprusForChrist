from django.contrib import admin
from .models import Sermon, SermonComment

@admin.register(Sermon)
class SermonAdmin(admin.ModelAdmin):
    list_display = ('title', 'pastor', 'is_published', 'created_at')
    list_filter = ('is_published', 'pastor', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'description', 'pastor', 'category')}),
        ('Media', {'fields': ('youtube_url', 'cover_image', 'pdf_file')}),
        ('Publication', {'fields': ('is_published',)}),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.pastor_id:
            obj.pastor = request.user
        super().save_model(request, obj, form, change)

@admin.register(SermonComment)
class SermonCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'sermon', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'user__username', 'sermon__title')
