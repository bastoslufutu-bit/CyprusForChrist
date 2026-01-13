
import os
import django
import sys

# Setup Django environment
sys.path.append(r'c:\Users\Administrator\Documents\Cyprusforchrist\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cyprus_api.settings')
django.setup()

from sermons.models import Sermon
from sermons.serializers import SermonSerializer

try:
    # Get last 5 sermons
    sermons = Sermon.objects.all().order_by('-created_at')[:5]
    for sermon in sermons:
        print(f"--- Sermon: {sermon.title} ---")
        print(f"URL: '{sermon.youtube_url}'")
        
        # Manually run the extraction logic
        serializer = SermonSerializer(sermon)
        print(f"Extracted ID: {serializer.get_youtube_id(sermon)}")

except Exception as e:
    print(f"Error: {e}")
