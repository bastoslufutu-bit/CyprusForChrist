import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cyprus_api.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# List of users to promote based on user request
promotions = [
    {'email': 'divinembiya876@gmail.com', 'role': 'PASTOR', 'first_name': 'Moi', 'last_name': 'Lk'},
    {'email': 'vincentlufutu01@gmail.com', 'role': 'PASTOR', 'first_name': 'Vincent', 'last_name': 'Kabamba'},
    {'email': 'vincent.ai.lvk@gmail.com', 'role': 'PASTOR', 'first_name': 'Vincent', 'last_name': 'Kabamba'}, # Fallback for local
    {'email': 'bastoslufutu@gmail.com', 'role': 'ADMIN', 'first_name': 'Bastos', 'last_name': 'Lufutu'},
]

def promote_users():
    print("Starting user promotions...")
    for p in promotions:
        try:
            user = User.objects.get(email=p['email'])
            old_role = user.role
            user.role = p['role']
            user.first_name = p['first_name']
            user.last_name = p['last_name']
            if p['role'] in ['ADMIN', 'PASTOR']:
                user.is_staff = True
            if p['role'] == 'ADMIN':
                user.is_superuser = True
            user.save()
            print(f"SUCCESS: Promoted {user.username} ({p['email']}) from {old_role} to {p['role']}")
        except User.DoesNotExist:
            print(f"SKIP: User with email {p['email']} not found.")
        except Exception as e:
            print(f"ERROR: Could not promote {p['email']}: {str(e)}")

if __name__ == "__main__":
    promote_users()
