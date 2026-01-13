from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from appointments.models import Appointment

class Message(models.Model):
    """Message entre un pasteur et un membre, potentiellement lié à un rendez-vous"""
    
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages'
    )
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name='messages',
        null=True,
        blank=True
    )
    content = models.TextField(_('Contenu'))
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')
        ordering = ['timestamp']

    def __str__(self):
        return f"De {self.sender.username} à {self.receiver.username} ({self.timestamp})"
