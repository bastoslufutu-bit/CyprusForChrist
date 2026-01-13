from rest_framework import viewsets, views, permissions, status
from rest_framework.response import Response
from .models import ContactRequest, ContactInfo
from .serializers import ContactRequestSerializer, ContactInfoSerializer
from .services import ContactService

class ContactRequestViewSet(viewsets.ModelViewSet):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ContactInfoView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        instance = ContactService.get_or_create_contact_info()
        serializer = ContactInfoSerializer(instance)
        return Response(serializer.data)

    def put(self, request):
        data = ContactService.update_contact_info(request.data)
        return Response(data)
