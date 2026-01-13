from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from donations.models import Donation
from donations.serializers import DonationSerializer
from django.db.models import Q
import csv
from django.http import HttpResponse

class AdminDonationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for admin donation management (read-only)"""
    queryset = Donation.objects.all().order_by('-created_at')
    serializer_class = DonationSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search filter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(user__first_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(project__icontains=search)
            )
        
        # Project filter
        project = self.request.query_params.get('project', None)
        if project:
            queryset = queryset.filter(project=project)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Export donations to CSV"""
        donations = self.get_queryset()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="donations.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Date', 'Donateur', 'Email', 'Montant', 'Projet', 'Statut'])
        
        for donation in donations:
            writer.writerow([
                donation.created_at.strftime('%Y-%m-%d'),
                f"{donation.user.first_name} {donation.user.last_name}" if donation.user else 'Anonyme',
                donation.user.email if donation.user else '',
                donation.amount,
                donation.project or 'Général',
                donation.status
            ])
        
        return response
