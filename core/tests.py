# core/tests.py
from django.test import TestCase
from .models import CustomUser

class CustomUserModelTest(TestCase):
    def test_create_user_with_additional_fields(self):
        user = CustomUser.objects.create_user(
            username='testuser',
            password='password123',
            phone_number='+1234567890',
            company=None,
            address='123 Farm Lane',
            date_of_birth='1990-01-01',
            role='manager',
            email='testuser@example.com',
            first_name='Test',
            last_name='User',
            is_active=True,
            is_staff=True,
            is_superuser=False,
            last_login=None,
        )

        self.assertEqual(user.phone_number, '+1234567890')
        self.assertEqual(user.address, '123 Farm Lane')
        self.assertEqual(user.date_of_birth, '1990-01-01')
        self.assertEqual(user.role, 'manager')
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertEqual(user.full_name, 'Test User')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('password123'))
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')

