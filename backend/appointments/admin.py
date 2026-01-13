from django.contrib import admin
from .models import Appointment, PastorAvailability

@admin.register(PastorAvailability)
class PastorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('pastor', 'day_of_week', 'start_time', 'end_time', 'is_active')
    list_filter = ('day_of_week', 'is_active', 'pastor')
    search_fields = ('pastor__username', 'pastor__email')
    ordering = ('day_of_week', 'start_time')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('member', 'pastor', 'requested_date', 'requested_time', 'status', 'subject')
    list_filter = ('status', 'requested_date', 'pastor')
    search_fields = ('member__username', 'pastor__username', 'subject')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-requested_date', '-requested_time')
    
    fieldsets = (
        ('Informations du rendez-vous', {
            'fields': ('member', 'pastor', 'requested_date', 'requested_time', 'status')
        }),
        ('Détails', {
            'fields': ('subject', 'notes', 'pastor_notes')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
