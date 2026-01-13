from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
import pyotp
import base64
from django_otp.plugins.otp_totp.models import TOTPDevice

User = get_user_model()

class UserAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.enable_2fa_url = reverse('enable_2fa')
        self.verify_2fa_url = reverse('verify_2fa')
        
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_registration(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'testpassword123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2) # setUp user + new user

    def test_login(self):
        data = {
            'username': self.user.username,
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_enable_2fa(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(self.enable_2fa_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('qr_code', response.data)
        self.assertIn('secret', response.data)
        
        self.assertTrue(TOTPDevice.objects.filter(user=self.user, confirmed=False).exists())

    def test_verify_2fa_success(self):
        self.client.force_authenticate(user=self.user)
        
        # 1. Enable 2FA to create device
        self.client.post(self.enable_2fa_url)
        device = TOTPDevice.objects.get(user=self.user, confirmed=False)
        
        # 2. Generate valid OTP
        # Ensure we use the same secret format as the device
        secret_b32 = base64.b32encode(device.bin_key).decode('utf-8')
        totp = pyotp.TOTP(secret_b32)
        otp = totp.now()
        
        # 3. Verify
        response = self.client.post(self.verify_2fa_url, {'otp': otp})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], '2FA enabled/verified successfully')
        
        device.refresh_from_db()
        self.assertTrue(device.confirmed)
        
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_2fa_enabled)

    def test_verify_2fa_invalid_otp(self):
        self.client.force_authenticate(user=self.user)
        
        # 1. Enable 2FA
        self.client.post(self.enable_2fa_url)
        
        # 2. Verify with wrong OTP
        response = self.client.post(self.verify_2fa_url, {'otp': '000000'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        device = TOTPDevice.objects.get(user=self.user)
        self.assertFalse(device.confirmed)
