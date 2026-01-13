import paypalrestsdk
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class PayPalService:
    @staticmethod
    def configure_sdk():
        paypalrestsdk.configure({
            "mode": settings.PAYPAL_MODE,
            "client_id": settings.PAYPAL_CLIENT_ID,
            "client_secret": settings.PAYPAL_CLIENT_SECRET
        })

    @staticmethod
    def create_payment(amount, currency, return_url, cancel_url, description="Don pour Cyprus For Christ"):
        PayPalService.configure_sdk()
        
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": return_url,
                "cancel_url": cancel_url
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Don",
                        "sku": "donation",
                        "price": str(amount),
                        "currency": currency,
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": str(amount),
                    "currency": currency
                },
                "description": description
            }]
        })

        if payment.create():
            return payment
        else:
            print(f"PAYPAL ERROR: {payment.error}") # DEBUG
            logger.error(f"Erreur PayPal Create: {payment.error}")
            return None

    @staticmethod
    def execute_payment(payment_id, payer_id):
        PayPalService.configure_sdk()
        payment = paypalrestsdk.Payment.find(payment_id)

        if payment.execute({"payer_id": payer_id}):
            return payment
        else:
            logger.error(f"Erreur PayPal Execute: {payment.error}")
            return None
