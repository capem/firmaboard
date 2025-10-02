from rest_framework import serializers
from .models import WindFarm, SolarFarm, WindTurbineModel, SolarPanelModel

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

class WindTurbineModelListSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = WindTurbineModel
        fields = ['id', 'manufacturer', 'model_name', 'label']

    def get_label(self, obj):
        return f"{obj.manufacturer} - {obj.model_name}"

class SolarPanelModelListSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = SolarPanelModel
        fields = ['id', 'manufacturer', 'model_name', 'label']

    def get_label(self, obj):
        return f"{obj.manufacturer} - {obj.model_name}"


class WindTurbineModelSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = WindTurbineModel
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_label(self, obj):
        return f"{obj.manufacturer} - {obj.model_name}"

    def validate(self, data):
        # When creating, manufacturer and model_name are required
        if not self.instance:
            if 'manufacturer' not in data or not data['manufacturer']:
                raise serializers.ValidationError({'manufacturer': 'Manufacturer is required.'})
            if 'model_name' not in data or not data['model_name']:
                raise serializers.ValidationError({'model_name': 'Model name is required.'})
        return data


class SolarPanelModelSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = SolarPanelModel
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_label(self, obj):
        return f"{obj.manufacturer} - {obj.model_name}"

    def validate(self, data):
        if not self.instance:
            if 'manufacturer' not in data or not data['manufacturer']:
                raise serializers.ValidationError({'manufacturer': 'Manufacturer is required.'})
            if 'model_name' not in data or not data['model_name']:
                raise serializers.ValidationError({'model_name': 'Model name is required.'})
        return data



class WindFarmCreateSerializer(serializers.ModelSerializer):
    turbine_model_id = serializers.PrimaryKeyRelatedField(
        source='turbine_model', queryset=WindTurbineModel.objects.all(), write_only=True
    )

    class Meta:
        model = WindFarm
        fields = [
            'id', 'name', 'location', 'latitude', 'longitude', 'total_area',
            'nominal_power', 'number_of_turbines', 'average_wind_speed',
            'layout_description', 'turbine_model_id'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        company = getattr(request.user, 'company', None) if request else None
        if company is None:
            raise serializers.ValidationError('No company associated with user')
        validated_data['company'] = company
        return super().create(validated_data)


class SolarFarmCreateSerializer(serializers.ModelSerializer):
    panel_model_id = serializers.PrimaryKeyRelatedField(
        source='panel_model', queryset=SolarPanelModel.objects.all(), write_only=True
    )
    tilt_angle = serializers.DecimalField(max_digits=4, decimal_places=1, required=False)
    azimuth_angle = serializers.DecimalField(max_digits=4, decimal_places=1, required=False)

    class Meta:
        model = SolarFarm
        fields = [
            'id', 'name', 'location', 'latitude', 'longitude', 'total_area',
            'nominal_power', 'number_of_panels', 'tracking_system', 'tilt_angle',
            'azimuth_angle', 'array_configuration', 'panel_model_id'
        ]

    def validate(self, attrs):
        # Provide sensible defaults for angles if not supplied
        if 'tilt_angle' not in attrs or attrs['tilt_angle'] is None:
            attrs['tilt_angle'] = 25.0
        if 'azimuth_angle' not in attrs or attrs['azimuth_angle'] is None:
            attrs['azimuth_angle'] = 180.0
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        company = getattr(request.user, 'company', None) if request else None
        if company is None:
            raise serializers.ValidationError('No company associated with user')
        validated_data['company'] = company
        return super().create(validated_data)

