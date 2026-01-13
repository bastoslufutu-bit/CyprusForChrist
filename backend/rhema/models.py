from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class Rhema(models.Model):
    title = models.CharField(_('Titre'), max_length=255)
    content = models.TextField(_('Contenu de la Parole'))
    verse = models.CharField(_('Référence Biblique'), max_length=255)
    meditation = models.TextField(_('Méditation / Note du Pasteur'), blank=True, null=True)
    
    pastor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='rhemas',
        limit_choices_to={'role__in': ['PASTOR', 'ADMIN']},
        null=True,
        blank=True
    )
    
    published_at = models.DateField(
        _('Date de publication'), 
        default=timezone.now,
        help_text=_("Le Rhema sera affiché à cette date précise.")
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Rhema')
        verbose_name_plural = _('Rhemas')
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return f"{self.published_at} - {self.title}"
