from .models import ContactInfo, ContactRequest

class ContactService:
    """
    Couche de service pour la gestion des contacts et informations d'église.
    """

    @staticmethod
    def get_or_create_contact_info():
        """
        Récupère ou crée l'unique instance des informations de contact.
        """
        obj, created = ContactInfo.objects.get_or_create(id=1)
        return obj

    @staticmethod
    def update_contact_info(data):
        """
        Met à jour les informations de contact.
        """
        instance = ContactService.get_or_create_contact_info()
        from .serializers import ContactInfoSerializer
        serializer = ContactInfoSerializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data
