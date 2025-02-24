from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import WindFarm, SolarFarm
from .serializers import WindFarmAssetSerializer, SolarFarmAssetSerializer

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def asset_list(request):
    """
    Get a combined list of wind and solar farm assets.
    Query params:
    - search: Optional search term for name or location
    - type: Optional filter by type ('wind' or 'solar')
    - status: Optional filter by status ('online' or 'offline')
    """
    # Get query parameters
    search = request.GET.get('search', '')
    asset_type = request.GET.get('type', '').lower()
    status = request.GET.get('status', '').lower()

    # Initialize empty lists for assets
    wind_farms = []
    solar_farms = []

    # Build base queries with search
    if search:
        wind_query = Q(name__icontains=search) | Q(location__icontains=search)
        solar_query = Q(name__icontains=search) | Q(location__icontains=search)
    else:
        wind_query = Q()
        solar_query = Q()

    # Add status filter if provided
    if status in ['online', 'offline']:
        is_operational = status == 'online'
        wind_query &= Q(operational_status=is_operational)
        solar_query &= Q(operational_status=is_operational)

    # Fetch assets based on type filter
    if not asset_type or asset_type == 'wind':
        wind_farms = WindFarm.objects.filter(wind_query)
        
    if not asset_type or asset_type == 'solar':
        solar_farms = SolarFarm.objects.filter(solar_query)

    # Serialize the data
    wind_data = WindFarmAssetSerializer(wind_farms, many=True).data
    solar_data = SolarFarmAssetSerializer(solar_farms, many=True).data

    # Combine and sort the results by name
    combined_assets = sorted(
        wind_data + solar_data,
        key=lambda x: x['name']
    )

    return Response(combined_assets)
