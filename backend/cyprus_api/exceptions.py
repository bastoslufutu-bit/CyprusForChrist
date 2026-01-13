"""
Custom exception handler for Cyprus For Christ API
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler pour des messages d'erreur plus clairs
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Personnaliser le format de la réponse d'erreur documentée
        response.data = {
            'success': False,
            'error': {
                'type': exc.__class__.__name__,
                'message': str(exc),
                'details': response.data
            }
        }
    else:
        # Cas d'une erreur 500 non gérée par DRF
        logger.error(f"Unhandled Server Error: {str(exc)}", exc_info=True)
        response = Response({
            'success': False,
            'error': {
                'type': 'ServerError',
                'message': 'Une erreur interne est survenue sur le serveur.',
                'details': None
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response


class InsufficientPermissionsError(Exception):
    """Exception levée quand l'utilisateur n'a pas les permissions nécessaires"""
    pass


class OpenAIServiceError(Exception):
    """Exception levée lors d'erreurs avec l'API OpenAI"""
    pass


class PayPalServiceError(Exception):
    """Exception levée lors d'erreurs avec l'API PayPal"""
    pass


class FileUploadError(Exception):
    """Exception levée lors d'erreurs d'upload de fichiers"""
    pass
