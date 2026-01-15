#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "Creating superuser..."
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cyprus_api.settings')
django.setup()
from users.models import User
if not User.objects.filter(email='bastoslufutu@gmail.com').exists():
    User.objects.create_superuser(
        email='bastoslufutu@gmail.com',
        password='admin123',
        first_name='Bastos',
        last_name='Lufutu'
    )
    print('Superuser created successfully!')
else:
    print('Superuser already exists.')
"
