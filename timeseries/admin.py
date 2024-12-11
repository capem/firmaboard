from django.contrib import admin
from .models import WindFarmTimeseries, SolarFarmTimeseries

class BaseTimeSeriesAdmin(admin.ModelAdmin):
    """
    Base admin configuration for TimeSeries models.
    Handles common configurations to promote DRY principles.
    """
    list_display = (
        'time',
        'farm',
        'node_id',
        'created_at',
        'updated_at',
    )
    list_filter = ('farm', 'node_id', 'time', 'created_at', 'updated_at')
    search_fields = ('farm__name', 'node_id')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-time',)

@admin.register(WindFarmTimeseries)
class WindFarmTimeseriesAdmin(BaseTimeSeriesAdmin):
    """
    Admin configuration for WindFarmTimeseries model.
    Extends BaseTimeSeriesAdmin to include Wind-specific fields.
    """
    list_display = BaseTimeSeriesAdmin.list_display + (
        'active_power_min',
        'active_power_max',
        'active_power_mean',
        'energy_accumulated',
        'energy_accumulated_export',
        'energy_accumulated_import',
        'wind_speed_mean',
        'wind_speed_stddev',
        'wind_direction_mean',
        'wind_direction_stddev',
        'power_reduction_time',
        'measurement_wind_speed_mean',
        'measurement_wind_direction_mean',
    )
    # 'node_id' is already included in the base class's list_display and list_filter

@admin.register(SolarFarmTimeseries)
class SolarFarmTimeseriesAdmin(BaseTimeSeriesAdmin):
    """
    Admin configuration for SolarFarmTimeseries model.
    Extends BaseTimeSeriesAdmin to include Solar-specific fields.
    """
    list_display = BaseTimeSeriesAdmin.list_display + (
        'solar_irradiance',
        'power_output',
        'module_temperature',
    )
    # 'node_id' is already included in the base class's list_display and list_filter
