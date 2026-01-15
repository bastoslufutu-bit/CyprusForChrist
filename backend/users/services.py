from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction

User = get_user_model()

class UserService:
    """
    Couche de service pour la logique métier liée aux utilisateurs.
    """

    @staticmethod
    def send_password_reset_email(user):
        """
        Génère un token et envoie un email de réinitialisation.
        """
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # URL du frontend
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        
        subject = "Réinitialisation de votre mot de passe - Cyprus For Christ"
        message = (
            f"Bonjour {user.username},\n\n"
            f"Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :\n{reset_url}\n\n"
            "Si vous n'avez pas demandé de réinitialisation, veuillez ignorer cet email."
        )
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return True

    @staticmethod
    @transaction.atomic
    def create_pastor(validated_data):
        """
        Crée un compte pasteur avec un mot de passe généré.
        """
        import string
        import random
        
        # Génération d'un mot de passe temporaire
        generated_password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=generated_password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=User.Role.PASTOR,
            phone_number=validated_data.get('phone_number', '')
        )
        
        return user, generated_password
