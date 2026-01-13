from rest_framework import serializers
from .models import Donation
from users.serializers import UserSerializer

class DonationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Donation
        fields = (
            'id', 'user', 'amount', 'currency', 'status', 'project',
            'paypal_payment_id', 'is_anonymous', 'created_at'
        )
        read_only_fields = ('user', 'status', 'paypal_payment_id', 'created_at')
