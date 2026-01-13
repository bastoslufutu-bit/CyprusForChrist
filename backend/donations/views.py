from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.conf import settings
from .models import Donation
from .serializers import DonationSerializer
from .services import PayPalService

class CreateDonationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        amount = request.data.get('amount')
        currency = request.data.get('currency', 'EUR')
        is_anonymous = request.data.get('is_anonymous', False)
        
        # In a real scenario, these URLs would point to your Frontend
        return_url = request.data.get('return_url', "http://localhost:5173/donation/success")
        cancel_url = request.data.get('cancel_url', "http://localhost:5173/donation/cancel")

        if not amount:
            return Response({"error": "Le montant est requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = PayPalService.create_payment(amount, currency, return_url, cancel_url)
        except Exception as e:
            print(f"EXCEPTION IN CREATE DONATION: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if payment:
            # Save the donation in PENDING status
            donation = Donation.objects.create(
                user=request.user if request.user.is_authenticated else None,
                amount=amount,
                currency=currency,
                paypal_payment_id=payment.id,
                is_anonymous=is_anonymous,
                status=Donation.Status.PENDING
            )
            
            # Find the approval URL to send back to the client
            approval_url = next(link.href for link in payment.links if link.rel == 'approval_url')
            
            return Response({
                "donation_id": donation.id,
                "paypal_payment_id": payment.id,
                "approval_url": approval_url
            }, status=status.HTTP_201_CREATED)
        
        return Response({"error": "Impossible de créer le paiement PayPal"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExecuteDonationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payment_id = request.data.get('payment_id')
        payer_id = request.data.get('payer_id')

        if not payment_id or not payer_id:
            return Response({"error": "payment_id et payer_id sont requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            donation = Donation.objects.get(paypal_payment_id=payment_id)
        except Donation.DoesNotExist:
            return Response({"error": "Donation introuvable"}, status=status.HTTP_404_NOT_FOUND)

        payment = PayPalService.execute_payment(payment_id, payer_id)

        if payment:
            donation.status = Donation.Status.COMPLETED
            donation.paypal_payer_id = payer_id
            donation.save()
            return Response({"status": "Donation complétée avec succès"}, status=status.HTTP_200_OK)
        else:
            donation.status = Donation.Status.FAILED
            donation.save()
            return Response({"error": "Échec de l'exécution du paiement"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DonationListView(views.APIView):
    """
    Liste des donations.
    Membres: Voient uniquement leurs donations
    Pasteur: Voit toutes les donations (READ-ONLY)
    Admin: Voit toutes les donations
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Pasteur et Admin voient toutes les donations
        if user.role in ['PASTOR', 'ADMIN'] or user.is_superuser:
            donations = Donation.objects.all().order_by('-created_at')
        # Membres voient uniquement leurs donations
        else:
            donations = Donation.objects.filter(user=user).order_by('-created_at')
        
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)
