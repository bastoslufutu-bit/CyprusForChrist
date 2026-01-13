from django.contrib import admin
from .models import InformationSection, Event, GalleryItem, Visionary

@admin.register(InformationSection)
class InformationSectionAdmin(admin.ModelAdmin):
    list_display = ('type', 'title', 'updated_at')
    list_filter = ('type',)
    search_fields = ('title', 'content')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'is_annual', 'is_past')
    list_filter = ('is_annual', 'is_past', 'date')
    search_fields = ('title', 'description')

@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title', 'caption')

@admin.register(Visionary)
class VisionaryAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'title', 'biography', 'history')
