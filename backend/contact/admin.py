from django.contrib import admin
from .models import ContactRequest, ContactInfo

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    
    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Marquer comme lu"

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('phone', 'email', 'updated_at')
    readonly_fields = ('updated_at',)
    
    def has_add_permission(self, request):
        # Only allow one ContactInfo instance
        return not ContactInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of ContactInfo
        return False
