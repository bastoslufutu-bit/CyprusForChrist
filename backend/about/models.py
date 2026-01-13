from django.db import models
from django.utils.translation import gettext_lazy as _

class InformationSection(models.Model):
    class SectionType(models.TextChoices):
        WHO_WE_ARE = 'WHO_WE_ARE', _('Qui sommes-nous')
        HISTORY = 'HISTORY', _('Historique / Notre Histoire')
        MISSIONS = 'MISSIONS', _('Missions & Vision')

    type = models.CharField(
        _('Type de section'),
        max_length=20,
        choices=SectionType.choices,
        unique=True
    )
    title = models.CharField(_('Titre'), max_length=255)
    content = models.TextField(_('Contenu'))
    image = models.ImageField(_('Image d\'illustration'), upload_to='about/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Section d\'information')
        verbose_name_plural = _('Sections d\'information')

    def __str__(self):
        return self.get_type_display()

class Event(models.Model):
    title = models.CharField(_('Titre de l\'événement'), max_length=255)
    description = models.TextField(_('Description'))
    date = models.DateField(_('Date de l\'événement'))
    time = models.TimeField(_('Heure'), blank=True, null=True)
    location = models.CharField(_('Lieu'), max_length=255, blank=True, null=True)
    category = models.CharField(_('Catégorie'), max_length=100, blank=True, null=True)
    image = models.ImageField(_('Image/Affiche'), upload_to='events/', blank=True, null=True)
    
    is_annual = models.BooleanField(_('Événement annuel'), default=False)
    is_past = models.BooleanField(_('Événement passé'), default=False)
    is_pinned = models.BooleanField(_('Épinglé en haut'), default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Événement')
        verbose_name_plural = _('Événements')
        ordering = ['-date']

    def __str__(self):
        return self.title

class GalleryItem(models.Model):
    title = models.CharField(_('Titre de la photo'), max_length=255, blank=True)
    image = models.ImageField(_('Photo'), upload_to='gallery/')
    caption = models.TextField(_('Légende'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Photo de la galerie')
        verbose_name_plural = _('Photos de la galerie')
        ordering = ['-created_at']

    def __str__(self):
        return self.title or f"Photo {self.id}"

class Visionary(models.Model):
    name = models.CharField(_('Nom complet'), max_length=255)
    title = models.CharField(_('Titre / Fonction'), max_length=255, help_text="Ex: Pasteur Fondateur, Visionnaire")
    biography = models.TextField(_('Biographie'))
    history = models.TextField(_('Historique personnel / Vision'))
    photo = models.ImageField(_('Photo officielle'), upload_to='visionaries/')
    
    # Social Links
    instagram = models.URLField(_('Lien Instagram'), blank=True, null=True)
    facebook = models.URLField(_('Lien Facebook'), blank=True, null=True)
    twitter = models.URLField(_('Lien Twitter (X)'), blank=True, null=True)
    youtube = models.URLField(_('Lien YouTube Personnel'), blank=True, null=True)
    
    is_active = models.BooleanField(_('Actif (Visible sur le site)'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Visionnaire')
        verbose_name_plural = _('Visionnaires')

    def __str__(self):
        return f"{self.name} - {self.title}"
