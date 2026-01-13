import os
import django
import sys
from django.db.models import Q
from rest_framework.test import APIRequestFactory

# Add backend directory to sys.path
sys.path.append(os.getcwd())
os.environ['DJANGO_SETTINGS_MODULE'] = 'cyprus_api.settings'
django.setup()

from users.admin_views import AdminUserViewSet
from django.contrib.auth import get_user_model

User = get_user_model()

def test_filters():
    # Setup users
    if not User.objects.filter(username='test_admin_filter').exists():
        User.objects.create_superuser('test_admin_filter', 'test_admin@example.com', 'pass')
    
    if not User.objects.filter(username='search_target').exists():
        User.objects.create_user('search_target', 'target@example.com', 'pass', first_name='Target', last_name='User')

    factory = APIRequestFactory()
    view = AdminUserViewSet.as_view({'get': 'list'})

    # Test 1: Search by username
    print("Testing Search 'search_target'...")
    request = factory.get('/api/admin/users/', {'search': 'search_target'})
    request.user = User.objects.get(username='test_admin_filter')
    response = view(request)
    print(f"Results count: {len(response.data.get('results', response.data))}")
    
    # Test 2: Search by partial email
    print("Testing Search 'target@'...")
    request = factory.get('/api/admin/users/', {'search': 'target@'})
    request.user = User.objects.get(username='test_admin_filter')
    response = view(request)
    print(f"Results count: {len(response.data.get('results', response.data))}")

    # Test 3: Search that should fail
    print("Testing Search 'nonexistent'...")
    request = factory.get('/api/admin/users/', {'search': 'nonexistent'})
    request.user = User.objects.get(username='test_admin_filter')
    response = view(request)
    print(f"Results count: {len(response.data.get('results', response.data))}")

    # Cleanup
    User.objects.get(username='test_admin_filter').delete()
    User.objects.get(username='search_target').delete()

if __name__ == "__main__":
    test_filters()
