from django.urls import path
from .views import AskAIView

urlpatterns = [
    path('ask/', AskAIView.as_view(), name='ai_ask'),
]
