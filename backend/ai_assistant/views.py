from rest_framework import views, status, permissions
from rest_framework.response import Response
from .serializers import AIConsultationSerializer
from .services import BiblicalAIService

class AskAIView(views.APIView):
    permission_classes = [permissions.AllowAny] # Open for all as requested

    def post(self, request):
        serializer = AIConsultationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            question = serializer.validated_data.get('question')
            language = request.data.get('language', 'fr') # Default to French
            
            # Call the AI service
            answer = BiblicalAIService.ask_bible(question, language)
            
            # Save the consultation to history
            user = request.user if request.user.is_authenticated else None
            serializer.save(user=user, answer=answer)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
