from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Administrateur')
        PASTOR = 'PASTOR', _('Pasteur')
        MODERATOR = 'MODERATOR', _('Modérateur')
        MEMBER = 'MEMBER', _('Membre')

    role = models.CharField(
        _('Rôle'),
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER
    )
    
    phone_number = models.CharField(_('Numéro de téléphone'), max_length=20, blank=True, null=True)
    is_2fa_enabled = models.BooleanField(_('2FA Activé'), default=False)
    profile_picture = models.ImageField(_('Photo de profil'), upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(_('Biographie'), max_length=500, blank=True)
    birth_date = models.DateField(_('Date de naissance'), blank=True, null=True)
    address = models.CharField(_('Adresse'), max_length=255, blank=True, null=True)
    
    member_id = models.CharField(_('Numéro de Membre'), max_length=20, unique=True, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Utilisateur')
        verbose_name_plural = _('Utilisateurs')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_pastor(self):
        return self.role == self.Role.PASTOR or self.is_superuser

    @property
    def is_moderator(self):
        return self.role in [self.Role.MODERATOR, self.Role.PASTOR] or self.is_superuser

    def save(self, *args, **kwargs):
        if self.role in [self.Role.ADMIN, self.Role.PASTOR, self.Role.MODERATOR]:
            self.is_staff = True
            
        super().save(*args, **kwargs)
        
        # Generate Member ID if not present and user is saved (has ID)
        if not self.member_id and self.pk:
            import datetime
            year = datetime.date.today().year
            self.member_id = f"CFC-{year}-{self.pk:04d}"

class PasswordResetCode(models.Model):
    email = models.EmailField(_('email address'))
    code = models.CharField(_('code'), max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        verbose_name = _('Code de réinitialisation')
        verbose_name_plural = _('Codes de réinitialisation')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} - {self.code}"
