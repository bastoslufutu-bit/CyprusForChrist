from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from users.models import User
from donations.models import Donation
from sermons.models import Sermon
from prayers.models import PrayerRequest
from about.models import Event, GalleryItem

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Users
        total_users = User.objects.count()
        new_users_month = User.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count()

        # Donations (Aggregate Sum)
        total_donations = Donation.objects.filter(status='COMPLETED').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Sermons
        total_sermons = Sermon.objects.count()
        
        # Prayer Requests
        active_requests = PrayerRequest.objects.filter(status='PENDING').count()

        # Events
        total_events = Event.objects.count()
        
        # Gallery
        total_photos = GalleryItem.objects.count()

        stats = [
            {
                'title': 'Membres',
                'value': total_users,
                'change': f"+{new_users_month} ce mois",
                'icon': 'FaUsers',
                'color': 'bg-gradient-to-r from-gold to-lightGold'
            },
            {
                'title': 'Requêtes en attente',
                'value': active_requests,
                'change': 'À traiter',
                'icon': 'FaPray',
                'color': 'bg-gradient-to-r from-bordeaux to-pink-600'
            },
            {
                'title': 'Dons (Total)',
                'value': f"{total_donations} €",
                'change': 'Cumulé',
                'icon': 'FaDonate',
                'color': 'bg-gradient-to-r from-royalBlue to-blue-400'
            },
            {
                'title': 'Sermons',
                'value': total_sermons,
                'change': 'Archives',
                'icon': 'FaVideo',
                'color': 'bg-gradient-to-r from-purple-600 to-purple-400'
            },
            {
                'title': 'Événements',
                'value': total_events,
                'change': 'Planifiés',
                'icon': 'FaCalendarAlt',
                'color': 'bg-gradient-to-r from-emerald-600 to-teal-400'
            },
            {
                'title': 'Galerie Photo',
                'value': total_photos,
                'change': 'Médiathèque',
                'icon': 'FaImage',
                'color': 'bg-gradient-to-r from-amber-500 to-yellow-400'
            }
        ]
        return Response(stats)

class DashboardChartsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # 1. Donations by Month (Line Chart) -> "Visites du site web" placeholder replacement
        # Since we don't track visits, we'll show Donations over time
        six_months_ago = timezone.now() - timedelta(days=180)
        
        donations_by_month = Donation.objects.filter(
            status='COMPLETED', 
            created_at__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Sum('amount')
        ).order_by('month')

        visits_data = [] # Reusing the variable name expected by frontend for now or adapting frontend
        # Let's adapt data to generic "name" and "visites" (or value) structure
        for entry in donations_by_month:
            visits_data.append({
                'name': entry['month'].strftime('%b'),
                'value': entry['total']
            })

        # 2. Users by Role (Pie Chart) -> "Répartition des dons" placeholder replacement
        # Or better yet, Donations by Type (One-time vs Recurring? We don't distinguish explicitly yet other than custom logic)
        # Let's do Users by Role
        roles_dist = User.objects.values('role').annotate(count=Count('id'))
        pie_data = []
        for entry in roles_dist:
            pie_data.append({
                'name': entry['role'],
                'value': entry['count']
            })

        return Response({
            'lineChart': visits_data, # Actually Donations
            'pieChart': pie_data      # Users by Role
        })

class RecentActivityView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        activities = []

        # Last 5 Users
        last_users = User.objects.order_by('-created_at')[:5]
        for user in last_users:
            activities.append({
                'id': f"user-{user.id}",
                'user': user.username,
                'action': 'Inscription',
                'time': user.created_at,
                'amount': '-'
            })

        # Last 5 Donations
        last_donations = Donation.objects.filter(status='COMPLETED').order_by('-created_at')[:5]
        for don in last_donations:
            user_name = don.user.username if don.user else "Anonyme"
            activities.append({
                'id': f"don-{don.id}",
                'user': user_name,
                'action': 'Nouveau don',
                'time': don.created_at,
                'amount': f"{don.amount} {don.currency}"
            })

        # Sort combined list by time desc
        activities.sort(key=lambda x: x['time'], reverse=True)
        
        # Serialize datetime for JSON
        for act in activities:
            # Simple string format for now, could be improved
            act['time'] = act['time'].strftime("%d/%m %H:%M")

        return Response(activities[:10])
