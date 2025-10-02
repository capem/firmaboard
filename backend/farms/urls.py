from django.urls import path
from . import views

urlpatterns = [
    path('assets/', views.asset_list, name='asset-list'),
    path('models/wind-turbines/', views.wind_turbine_models, name='wind-turbine-models'),
    path('models/solar-panels/', views.solar_panel_models, name='solar-panel-models'),
] 
