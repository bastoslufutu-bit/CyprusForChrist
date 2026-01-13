from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

class PastorAvailability(models.Model):
    """Définit les jours et heures où le pasteur est disponible pour recevoir"""
    
    class DayOfWeek(models.TextChoices):
        MONDAY = 'MONDAY', _('Lundi')
        TUESDAY = 'TUESDAY', _('Mardi')
        WEDNESDAY = 'WEDNESDAY', _('Mercredi')
        THURSDAY = 'THURSDAY', _('Jeudi')
        FRIDAY = 'FRIDAY', _('Vendredi')
        SATURDAY = 'SATURDAY', _('Samedi')
        SUNDAY = 'SUNDAY', _('Dimanche')
    
    pastor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='availabilities',
        limit_choices_to={'role': 'PASTOR'}
    )
    day_of_week = models.CharField(
        _('Jour de la semaine'),
        max_length=10,
        choices=DayOfWeek.choices
    )
    start_time = models.TimeField(_('Heure de début'))
    end_time = models.TimeField(_('Heure de fin'))
    is_active = models.BooleanField(_('Actif'), default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Disponibilité du Pasteur')
        verbose_name_plural = _('Disponibilités du Pasteur')
        ordering = ['day_of_week', 'start_time']
        unique_together = ['pastor', 'day_of_week', 'start_time']
    
    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError(_("L'heure de fin doit être après l'heure de début"))
    
    def __str__(self):
        return f"{self.pastor.username} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"


class Appointment(models.Model):
    """Rendez-vous entre un membre et le pasteur"""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('En attente')
        CONFIRMED = 'CONFIRMED', _('Confirmé')
        CANCELLED = 'CANCELLED', _('Annulé')
        COMPLETED = 'COMPLETED', _('Terminé')
    
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments_as_member',
        limit_choices_to={'role': 'MEMBER'}
    )
    pastor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments_as_pastor',
        limit_choices_to={'role': 'PASTOR'}
    )
    
    requested_date = models.DateField(_('Date souhaitée'))
    requested_time = models.TimeField(_('Heure souhaitée'))
    
    status = models.CharField(
        _('Statut'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    subject = models.CharField(_('Sujet du rendez-vous'), max_length=255)
    notes = models.TextField(_('Notes / Détails'), blank=True)
    
    pastor_notes = models.TextField(_('Notes pour le Pasteur (privé)'), blank=True)
    
    location = models.CharField(_('Lieu / Lien'), max_length=255, blank=True, help_text=_("Lieu physique ou lien de visio"))
    message_to_member = models.TextField(_('Message pour le membre'), blank=True, help_text=_("Instructions ou message pour le membre"))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Rendez-vous')
        verbose_name_plural = _('Rendez-vous')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.member.username} avec {self.pastor.username} - {self.requested_date}"
