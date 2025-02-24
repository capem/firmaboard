from rest_framework import serializers
from .models import WindFarm, SolarFarm

class BaseAssetSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    power = serializers.SerializerMethodField()

    def get_status(self, obj):
        # For now, we'll use a simple mapping from operational_status
        # TODO: In the future, this should be based on real-time data from timeseries
        return "Online" if obj.operational_status else "Offline"

    def get_power(self, obj):
        return f"{obj.nominal_power} MW"

class WindFarmAssetSerializer(BaseAssetSerializer):
    class Meta:
        model = WindFarm
        fields = ['id', 'name', 'location', 'type', 'status', 'power']

    def get_type(self, obj):
        return 'wind'

class SolarFarmAssetSerializer(BaseAssetSerializer):
    class Meta:
        model = SolarFarm
        fields = ['id', 'name', 'location', 'type', 'status', 'power']

    def get_type(self, obj):
        return 'solar' 