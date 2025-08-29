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
    Get a combined list of wind and solar farm assets for the authenticated user's company.
    Query params:
    - search: Optional search term for name or location
    - type: Optional filter by type ('wind' or 'solar')
    - status: Optional filter by status ('online' or 'offline')
    """
    # Resolve tenant (company)
    company = getattr(request.user, 'company', None)
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
