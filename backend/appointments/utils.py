from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_appointment_confirmation_email(appointment):
    """
    Envoie un email de confirmation au membre avec les détails du rendez-vous.
    """
    try:
        subject = f"Confirmation de votre rendez-vous - {settings.CHURCH_INFO['name']}"
        
        message = f"""
Bonjour {appointment.member.first_name or appointment.member.username},

Votre demande de rendez-vous avec le Pasteur {appointment.pastor.get_full_name()} a été confirmée.

Détails du rendez-vous :
-----------------------
Date : {appointment.requested_date.strftime('%d/%m/%Y')}
Heure : {appointment.requested_time.strftime('%H:%M')}
Sujet : {appointment.subject}

Lieu / Lien de connexion :
{appointment.location}

Message du Pasteur :
{appointment.message_to_member if appointment.message_to_member else "Aucun message particulier."}

Merci de votre confiance.

Cordialement,
{settings.CHURCH_INFO['name']}
{settings.CHURCH_INFO['website']}
"""
        
        recipient_list = [appointment.member.email]
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            fail_silently=False,
        )
        logger.info(f"Email de confirmation envoyé à {appointment.member.email} pour le RDV {appointment.id}")
        return True
    
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email de confirmation pour le RDV {appointment.id}: {str(e)}")
        return False
