from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, schema
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model, authenticate
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from farms.models import Company
from django.conf import settings
from rest_framework.reverse import reverse
from rest_framework.schemas import AutoSchema
import logging
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

User = get_user_model()

# Set up logger
logger = logging.getLogger(__name__)

def get_tokens_for_user(user, remember_me=False):
    """
    Generate JWT tokens for the given user with different lifetimes based on remember_me
    """
    refresh = RefreshToken.for_user(user)
    
    # Set token lifetimes based on remember_me
    if remember_me:
        refresh.set_exp(lifetime=settings.SIMPLE_JWT['REMEMBER_ME_REFRESH_TOKEN_LIFETIME'])
        refresh.access_token.set_exp(lifetime=settings.SIMPLE_JWT['REMEMBER_ME_ACCESS_TOKEN_LIFETIME'])
    else:
        refresh.set_exp(lifetime=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'])
        refresh.access_token.set_exp(lifetime=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'])
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@schema(AutoSchema())
def api_root(request):
    """
    API Root endpoint that lists all available core API endpoints.
    
    Returns a dictionary of all available endpoints in the core API.
    """
    return Response({
        'register': reverse('core:register', request=request),
        'login': reverse('core:login', request=request),
        'logout': reverse('core:logout', request=request),
        'session': reverse('core:session', request=request),
        'complete_onboarding': reverse('core:complete_onboarding', request=request),
        'token_refresh': reverse('core:token_refresh', request=request),
    })

@api_view(['POST'])
@permission_classes([AllowAny])
@schema(AutoSchema())
def register_user(request):
    """
    Register a new user with company details.
    
    Example request:
    ```json
    {
        "email": "user@example.com",
        "password": "securepassword",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "+1234567890",
        "address": "123 Main St",
        "role": "owner",
        "company": {
            "name": "Example Corp",
            "registration_number": "FB123456789",
            "address": "123 Main St",
            "contact_email": "user@example.com",
            "contact_phone": "+1234567890",
            "definitions": ["solar", "wind"]
        }
    }
    ```
    """
    try:
        with transaction.atomic():
            # Log the received data (excluding password)
            safe_data = {**request.data}
            safe_data.pop('password', None)
            logger.info(f"Attempting to register user with data: {safe_data}")

            # Check if user already exists
            email = request.data.get('email')
            if User.objects.filter(username=email).exists():
                raise ValueError("A user with this email already exists")

            # Validate company data
            company_data = request.data.get('company')
            if not company_data:
                raise ValueError("Company data is required")
            
            required_company_fields = ['name', 'registration_number', 'address', 'contact_email', 'contact_phone']
            missing_fields = [field for field in required_company_fields if not company_data.get(field)]
            if missing_fields:
                raise ValueError(f"Missing required company fields: {', '.join(missing_fields)}")

            # Create company
            company = Company.objects.create(
                name=company_data['name'],
                registration_number=company_data['registration_number'],
                address=company_data['address'],
                contact_email=company_data['contact_email'],
                contact_phone=company_data['contact_phone']
            )
            logger.info(f"Created company: {company.name} (ID: {company.id})")

            # Create user
            user_data = {
                'email': request.data['email'],
                'username': request.data['email'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name'],
                'phone_number': request.data['phone_number'],
                'address': request.data['address'],
                'role': request.data.get('role', 'owner'),
                'company': company,
            }
            
            user = User.objects.create_user(
                **user_data,
                password=request.data['password']
            )
            logger.info(f"Created user: {user.email} (ID: {user.id})")

            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                },
                'tokens': tokens,
            }, status=status.HTTP_201_CREATED)

    except ValueError as e:
        logger.error(f"Validation error during registration: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@schema(AutoSchema())
def login_user(request):
    """
    Authenticate and login a user.
    
    Example request:
    ```json
    {
        "email": "user@example.com",
        "password": "securepassword",
        "rememberMe": false
    }
    ```
    
    Returns:
    ```json
    {
        "message": "Login successful",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "role": "owner"
        },
        "tokens": {
            "refresh": "token",
            "access": "token"
        }
    }
    ```
    """
    email = request.data.get('email')
    password = request.data.get('password')
    remember_me = request.data.get('rememberMe', False)

    if not email or not password:
        return Response({
            'error': 'Please provide both email and password'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=email, password=password)

    if user is not None:
        tokens = get_tokens_for_user(user, remember_me)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
            },
            'tokens': tokens,
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@schema(AutoSchema())
def logout_user(request):
    """
    Logout the current user by blacklisting their refresh token.
    
    Example request:
    ```json
    {
        "refresh_token": "your-refresh-token"
    }
    ```
    
    Returns:
    ```json
    {
        "message": "Logged out successfully"
    }
    ```
    """
    refresh_token = request.data.get('refresh_token')
    
    if not refresh_token:
        logger.warning(f"Logout attempt without refresh token by user {request.user.id}")
        return Response({
            'error': 'Refresh token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Try to decode the token first
        token = RefreshToken(refresh_token)
        
        # Check if token belongs to the current user
        if token.get('user_id') != request.user.id:
            logger.warning(f"User {request.user.id} attempted to blacklist token belonging to user {token.get('user_id')}")
            return Response({
                'error': 'Invalid token for current user'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Add token to blacklist
        token.blacklist()
        
        logger.info(f"User {request.user.id} successfully logged out")
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
        
    except TokenError as e:
        logger.error(f"TokenError during logout for user {request.user.id}: {str(e)}")
        return Response({
            'error': 'Token is invalid or expired'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Unexpected error during logout for user {request.user.id}: {str(e)}")
        return Response({
            'error': 'An unexpected error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@schema(AutoSchema())
def get_user_session(request):
    """
    Get the current user's session information.
    
    Returns:
    ```json
    {
        "isAuthenticated": true,
        "user": {
            "id": 1,
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "role": "owner"
        }
    }
    ```
    """
    return Response({
        'isAuthenticated': True,
        'user': {
            'id': request.user.id,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'role': request.user.role,
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@schema(AutoSchema())
def complete_onboarding(request):
    """
    Complete the onboarding process by updating user and company preferences.
    
    Example request:
    ```json
    {
        "user_id": 1,
        "mainOutput": "crops",
        "dataConnection": "manual"
    }
    ```
    
    Returns:
    ```json
    {
        "message": "Onboarding completed successfully"
    }
    ```
    """
    try:
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        company = user.company

        company.main_output = request.data.get('mainOutput')
        company.data_connection = request.data.get('dataConnection')
        company.save()

        return Response({
            'message': 'Onboarding completed successfully'
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
