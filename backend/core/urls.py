from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('session/', views.get_user_session, name='session'),
    path('complete-onboarding/', views.complete_onboarding, name='complete_onboarding'),
    path('setup-company-profile/', views.setup_company_profile, name='setup_company_profile'),
    path('oauth/google/', views.google_oauth_login, name='google_oauth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 
