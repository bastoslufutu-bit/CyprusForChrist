from django.contrib import admin
from .models import Donation

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('amount', 'currency', 'get_payer', 'status', 'created_at')
    list_filter = ('status', 'currency', 'created_at')
    search_fields = ('paypal_payment_id', 'paypal_payer_id', 'user__username')
    readonly_fields = ('paypal_payment_id', 'paypal_payer_id', 'created_at', 'updated_at')

    def get_payer(self, obj):
        if obj.is_anonymous:
            return "Anonyme"
        return obj.user.username if obj.user else "Visiteur"
    get_payer.short_description = "Donateur"
