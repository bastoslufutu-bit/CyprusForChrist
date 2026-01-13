from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class AIConsultation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ai_consultations'
    )
    question = models.TextField(_('Question'))
    answer = models.TextField(_('Réponse de l\'IA'))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Consultation IA')
        verbose_name_plural = _('Consultations IA')
        ordering = ['-created_at']

    def __str__(self):
        return f"Question de {self.user.username if self.user else 'Anonyme'} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
