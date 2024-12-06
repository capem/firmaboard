from django.db import models
from timescale.db.models.models import TimescaleModel
from timescale.db.models.fields import TimescaleDateTimeField
from timescale.db.models.managers import TimescaleManager
from farms.models import WindFarm, SolarFarm

class BaseTimeSeriesData(models.Model):
    time = TimescaleDateTimeField(interval="1 day")
    station_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()
    timescale = TimescaleManager()

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['time']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['time', 'station_id'],
                name='%(app_label)s_%(class)s_unique_time_station'
            )
        ]

class WindFarmTimeseries(BaseTimeSeriesData):
    station = models.ForeignKey(
        WindFarm, 
        on_delete=models.CASCADE, 
        related_name='timeseries_data'
    )
    wind_speed = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Wind speed in m/s"
    )
    wind_direction = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Wind direction in degrees"
    )
    power_output = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Power output in kW"
    )
    temperature = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Ambient temperature in °C"
    )

    def save(self, *args, **kwargs):
        self.station_id = self.station.id
        super().save(*args, **kwargs)

    class Meta(BaseTimeSeriesData.Meta):
        verbose_name = "Wind Farm Time Series Data"
        verbose_name_plural = "Wind Farm Time Series Data"

class SolarFarmTimeseries(BaseTimeSeriesData):
    station = models.ForeignKey(
        SolarFarm, 
        on_delete=models.CASCADE, 
        related_name='timeseries_data'
    )
    solar_irradiance = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        help_text="Solar irradiance in W/m²"
    )
    power_output = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Power output in kW"
    )
    module_temperature = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Module temperature in °C"
    )

    def save(self, *args, **kwargs):
        self.station_id = self.station.id
        super().save(*args, **kwargs)

    class Meta(BaseTimeSeriesData.Meta):
        verbose_name = "Solar Farm Time Series Data"
        verbose_name_plural = "Solar Farm Time Series Data"
