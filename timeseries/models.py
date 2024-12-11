from django.db import models
from timescale.db.models.models import TimescaleModel
from timescale.db.models.fields import TimescaleDateTimeField
from timescale.db.models.managers import TimescaleManager
from farms.models import WindFarm, SolarFarm


class BaseTimeSeriesData(models.Model):
    time = TimescaleDateTimeField(interval="10 minutes")
    farm_id = models.IntegerField()
    node_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()
    timescale = TimescaleManager()

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=["time", "node_id", "farm_id"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["time", "node_id", "farm_id"], 
                name="%(app_label)s_%(class)s_unique_time_station",
            )
        ]


class WindFarmTimeseries(BaseTimeSeriesData):
    farm = models.ForeignKey(
        WindFarm, on_delete=models.CASCADE, related_name="timeseries_data"
    )

    active_power_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Minimum active power in kW",
    )
    active_power_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Maximum active power in kW",
    )
    active_power_mean = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Mean active power in kW",
    )

    energy_accumulated = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total accumulated energy in kWh",
    )
    energy_accumulated_export = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total exported energy in kWh",
    )
    energy_accumulated_import = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total imported energy in kWh",
    )

    wind_speed_mean = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Mean wind speed in m/s",
    )
    wind_speed_stddev = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Standard deviation of wind speed",
    )
    wind_direction_mean = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Mean wind direction in degrees",
    )
    wind_direction_stddev = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Standard deviation of wind direction",
    )

    power_reduction_time = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Time spent in power reduction mode",
    )

    measurement_wind_speed_mean = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Mean measured wind speed in m/s",
    )
    measurement_wind_direction_mean = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Mean measured wind direction in degrees",
    )

    def save(self, *args, **kwargs):
        self.farm_id = self.farm.id
        super().save(*args, **kwargs)

    class Meta(BaseTimeSeriesData.Meta):
        verbose_name = "Wind Farm Time Series Data"
        verbose_name_plural = "Wind Farm Time Series Data"


class SolarFarmTimeseries(BaseTimeSeriesData):
    farm = models.ForeignKey(
        SolarFarm, on_delete=models.CASCADE, related_name="timeseries_data"
    )
    solar_irradiance = models.DecimalField(
        max_digits=7, decimal_places=2, help_text="Solar irradiance in W/m²"
    )
    power_output = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Power output in kW"
    )
    module_temperature = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Module temperature in °C"
    )

    def save(self, *args, **kwargs):
        self.farm_id = self.farm.id
        super().save(*args, **kwargs)

    class Meta(BaseTimeSeriesData.Meta):
        verbose_name = "Solar Farm Time Series Data"
        verbose_name_plural = "Solar Farm Time Series Data"
