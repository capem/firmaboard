from django.contrib import admin
from .models import WindFarmTimeseries, SolarFarmTimeseries

@admin.register(WindFarmTimeseries)
class WindFarmTimeseriesAdmin(admin.ModelAdmin):
    list_display = ('time', 'station', 'wind_speed', 'power_output', 'temperature')
    list_filter = ('station', 'time')
    search_fields = ('station__name',)
    date_hierarchy = 'time'
    readonly_fields = ('created_at', 'updated_at')

    def get_queryset(self, request):
        return self.model.timescale.all()

@admin.register(SolarFarmTimeseries)
class SolarFarmTimeseriesAdmin(admin.ModelAdmin):
    list_display = ('time', 'station', 'solar_irradiance', 'power_output', 'module_temperature')
    list_filter = ('station', 'time')
    search_fields = ('station__name',)
    date_hierarchy = 'time'
    readonly_fields = ('created_at', 'updated_at')

    def get_queryset(self, request):
        return self.model.timescale.all()
