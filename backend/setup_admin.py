import os
import django
import sys

# Configuration de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cyprus_api.settings')
django.setup()

from users.models import User

def setup_admin():
    email = 'bastoslufutu@gmail.com'
    password = 'admin123'
    
    print(f"Vérification de l'utilisateur {email}...")
    
    user = User.objects.filter(email=email).first()
    
    if not user:
        print("L'utilisateur n'existe pas. Création...")
        User.objects.create_superuser(
            username=email,
            email=email,
            password=password,
            first_name='Bastos',
            last_name='Lufutu',
            role='ADMIN'
        )
        print("✅ Superuser créé avec succès !")
    else:
        print("L'utilisateur existe déjà. Mise à jour du mot de passe et des droits...")
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.role = 'ADMIN'
        user.save()
        print("✅ Utilisateur mis à jour avec succès !")

if __name__ == "__main__":
    try:
        setup_admin()
    except Exception as e:
        print(f"❌ Erreur lors de la configuration de l'admin : {e}")
        sys.exit(1)
