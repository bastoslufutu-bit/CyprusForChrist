from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Appointment, PastorAvailability
from .serializers import AppointmentSerializer, AppointmentUpdateSerializer, PastorAvailabilitySerializer
from users.permissions import IsPastorOrAdmin, IsMember, IsOwnerOrAdmin

User = get_user_model()


class PastorAvailabilityListView(generics.ListCreateAPIView):
    """
    Liste des disponibilités du pasteur.
    GET: Accessible à tous les authentifiés (pour voir quand prendre RDV)
    POST: Réservé au pasteur
    """
    serializer_class = PastorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        # Afficher uniquement les disponibilités actives pour les membres
        if self.request.user.role == 'MEMBER':
            return PastorAvailability.objects.filter(is_active=True)
        # Le pasteur voit toutes ses disponibilités
        elif self.request.user.role == 'PASTOR':
            return PastorAvailability.objects.filter(pastor=self.request.user)
        # Admin voit tout
        else:
            return PastorAvailability.objects.all()
    
    def perform_create(self, serializer):
        # Forcer le pasteur à être l'utilisateur courant
        serializer.save(pastor=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Vérifier que seul le pasteur peut créer
        if request.user.role != 'PASTOR':
            return Response(
                {'error': 'Seuls les pasteurs peuvent créer des disponibilités'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)


class PastorAvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Détails d'une disponibilité.
    Seul le pasteur propriétaire peut modifier/supprimer
    """
    serializer_class = PastorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'PASTOR':
            return PastorAvailability.objects.filter(pastor=self.request.user)
        return PastorAvailability.objects.all()
    
    def update(self, request, *args, **kwargs):
        if request.user.role != 'PASTOR':
            return Response(
                {'error': 'Seuls les pasteurs peuvent modifier leurs disponibilités'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'PASTOR':
            return Response(
                {'error': 'Seuls les pasteurs peuvent supprimer leurs disponibilités'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


class AppointmentListCreateView(generics.ListCreateAPIView):
    """
    Liste et création de rendez-vous.
    GET: Membres voient leurs RDV, Pasteurs voient tous les RDV
    POST: Membres peuvent créer des RDV
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        user = self.request.user
        
        # Membres voient uniquement leurs rendez-vous
        if user.role == 'MEMBER':
            return Appointment.objects.filter(member=user)
        # Pasteurs voient tous les rendez-vous avec eux
        elif user.role == 'PASTOR':
            return Appointment.objects.filter(pastor=user)
        # Admin voit tout
        else:
            return Appointment.objects.all()
    
    def perform_create(self, serializer):
        # Le membre est automatiquement l'utilisateur courant
        # Le pasteur doit être spécifié dans la requête
        serializer.save(member=self.request.user, status='PENDING')
    
    def create(self, request, *args, **kwargs):
        # Seuls les membres peuvent créer des rendez-vous
        if request.user.role != 'MEMBER':
            return Response(
                {'error': 'Seuls les membres peuvent créer des rendez-vous'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Détails d'un rendez-vous.
    Membre peut voir/annuler son RDV
    Pasteur peut voir/modifier le statut de tous ses RDV
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        # Pasteur utilise un serializer différent pour mettre à jour
        if self.request.user.role == 'PASTOR' and self.request.method in ['PUT', 'PATCH']:
            return AppointmentUpdateSerializer
        return AppointmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'MEMBER':
            return Appointment.objects.filter(member=user)
        elif user.role == 'PASTOR':
            return Appointment.objects.filter(pastor=user)
        else:
            return Appointment.objects.all()
    
    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        user = request.user
        
        # Membre peut seulement annuler son rendez-vous
        if user.role == 'MEMBER':
            if request.data.get('status') == 'CANCELLED':
                appointment.status = 'CANCELLED'
                appointment.save()
                return Response(AppointmentSerializer(appointment).data)
            return Response(
                {'error': 'Les membres peuvent seulement annuler leurs rendez-vous'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Pasteur peut modifier le statut et les notes
        elif user.role == 'PASTOR':
            response = super().update(request, *args, **kwargs)
            
            # Si le statut passe à CONFIRMED, envoyer un email
            if response.status_code == status.HTTP_200_OK and request.data.get('status') == 'CONFIRMED':
                try:
                    # Recharger l'objet pour avoir les données à jour (location, message...)
                    appointment.refresh_from_db()
                    # Import ici pour éviter les imports circulaires
                    from .utils import send_appointment_confirmation_email
                    send_appointment_confirmation_email(appointment)
                except Exception as e:
                    print(f"Erreur envoi email: {e}")
            
            return response
        
        # Admin peut tout faire
        else:
            return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # Membres, Pasteurs et Admins peuvent supprimer
        return super().destroy(request, *args, **kwargs)
