from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from decimal import Decimal
from .models import WindFarm, SolarFarm, WindTurbineModel, SolarPanelModel
from .serializers import (
    WindFarmAssetSerializer,
    SolarFarmAssetSerializer,
    WindTurbineModelListSerializer,
    SolarPanelModelListSerializer,
    WindFarmCreateSerializer,
    SolarFarmCreateSerializer,
)

# Create your views here.

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def asset_list(request):
    """
    Get a combined list of wind and solar farm assets for the authenticated user's company.
    Query params:
    - search: Optional search term for name or location
    - type: Optional filter by type ('wind' or 'solar')
    - status: Optional filter by status ('online' or 'offline')
    """
    # Resolve tenant (company)
    company = getattr(request.user, 'company', None)
    if request.method == 'POST':
        # Create asset from onboarding
        asset_type = request.data.get('type')
        if asset_type == 'wind':
            serializer = WindFarmCreateSerializer(data=request.data, context={'request': request})
        elif asset_type == 'solar':
            serializer = SolarFarmCreateSerializer(data=request.data, context={'request': request})
        else:
            return Response({'detail': 'Invalid type. Use "wind" or "solar".'}, status=400)
        if not company:
            return Response({'detail': 'No company for user'}, status=400)
        if serializer.is_valid():
            obj = serializer.save()
            # Return the unified asset representation expected by frontend list
            unified = (WindFarmAssetSerializer(obj).data if asset_type == 'wind' else SolarFarmAssetSerializer(obj).data)
            return Response(unified, status=201)
        return Response(serializer.errors, status=400)

    if company is None:
        # No company assigned -> no assets
        return Response([])

    # Get query parameters
    search = request.GET.get('search', '')
    asset_type = request.GET.get('type', '').lower()
    status = request.GET.get('status', '').lower()

    # Build base queries with search
    wind_query = Q(company=company)
    solar_query = Q(company=company)
    if search:
        wind_query &= Q(name__icontains=search) | Q(location__icontains=search)
        solar_query &= Q(name__icontains=search) | Q(location__icontains=search)

    # Add status filter if provided
    if status in ['online', 'offline']:
        is_operational = status == 'online'
        wind_query &= Q(operational_status=is_operational)
        solar_query &= Q(operational_status=is_operational)

    # Fetch assets based on type filter
    wind_farms = []
    solar_farms = []
    if not asset_type or asset_type == 'wind':
        wind_farms = WindFarm.objects.filter(wind_query)
    if not asset_type or asset_type == 'solar':
        solar_farms = SolarFarm.objects.filter(solar_query)

    # Serialize the data
    wind_data = WindFarmAssetSerializer(wind_farms, many=True).data
    solar_data = SolarFarmAssetSerializer(solar_farms, many=True).data

    # Combine and sort the results by name
    combined_assets = sorted(wind_data + solar_data, key=lambda x: x['name'])
    return Response(combined_assets)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def wind_turbine_models(request):
    """
    GET: Search/list wind turbine models (manufacturer/model_name). Optional ?q= filter.
    POST: Create an official wind turbine model entry with minimal defaults if missing fields.
    """
    if request.method == 'POST':
        manufacturer = (request.data.get('manufacturer') or '').strip()
        model_name = (request.data.get('model_name') or '').strip()
        if not manufacturer or not model_name:
            return Response({"detail": "manufacturer and model_name are required"}, status=400)
        # Minimal defaults to satisfy validators
        defaults = {
            'power_output': Decimal('0.00'),
            'cut_in_speed': Decimal('3.0'),
            'cut_out_speed': Decimal('25.0'),
            'rotor_diameter': Decimal('20.00'),
            'hub_height': Decimal('20.00'),
        }
        obj, created = WindTurbineModel.objects.get_or_create(
            manufacturer=manufacturer,
            model_name=model_name,
            defaults=defaults,
        )
        return Response({'id': obj.id, 'label': f"{obj.manufacturer} - {obj.model_name}"}, status=201 if created else 200)

    # GET flow
    q = request.GET.get('q', '').strip()
    qs = WindTurbineModel.objects.all()
    if q:
        qs = qs.filter(Q(manufacturer__icontains=q) | Q(model_name__icontains=q))
    qs = qs.order_by('manufacturer', 'model_name')[:50]
    data = WindTurbineModelListSerializer(qs, many=True).data
    return Response(data)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def solar_panel_models(request):
    """
    GET: Search/list solar panel models (manufacturer/model_name). Optional ?q= filter.
    POST: Create an official solar panel model entry with minimal defaults if missing fields.
    """
    if request.method == 'POST':
        manufacturer = (request.data.get('manufacturer') or '').strip()
        model_name = (request.data.get('model_name') or '').strip()
        if not manufacturer or not model_name:
            return Response({"detail": "manufacturer and model_name are required"}, status=400)
        # Minimal defaults to satisfy validators and clean() constraints
        defaults = {
            'technology_type': 'OTHER',
            'power_output': Decimal('0.00'),
            'efficiency': Decimal('20.00'),
            'vmp': Decimal('40.00'),
            'voc': Decimal('48.00'),
            'imp': Decimal('10.00'),
            'isc': Decimal('11.00'),
            'temp_coefficient_pmax': Decimal('-0.50'),
            'temp_coefficient_voc': Decimal('-0.30'),
            'temp_coefficient_isc': Decimal('0.05'),
            'nominal_operating_temp': Decimal('45.0'),
            'length': Decimal('1800.00'),
            'width': Decimal('1100.00'),
            'depth': Decimal('35.00'),
            'weight': Decimal('20.00'),
        }
        obj, created = SolarPanelModel.objects.get_or_create(
            manufacturer=manufacturer,
            model_name=model_name,
            defaults=defaults,
        )
        return Response({'id': obj.id, 'label': f"{obj.manufacturer} - {obj.model_name}"}, status=201 if created else 200)

    # GET flow
    q = request.GET.get('q', '').strip()
    qs = SolarPanelModel.objects.all()
    if q:
        qs = qs.filter(Q(manufacturer__icontains=q) | Q(model_name__icontains=q))
    qs = qs.order_by('manufacturer', 'model_name')[:50]
    data = SolarPanelModelListSerializer(qs, many=True).data
    return Response(data)