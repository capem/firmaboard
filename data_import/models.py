from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType
from farms.models import WindFarm, SolarFarm

class ImportJob(models.Model):
    IMPORT_SOURCE_CHOICES = [
        ('file', 'File'),
        ('database', 'Database'),
    ]

    name = models.CharField(max_length=255)
    source_type = models.CharField(max_length=10, choices=IMPORT_SOURCE_CHOICES)
    file = models.FileField(upload_to='imports/', null=True, blank=True)
    db_connection = models.CharField(max_length=255, null=True, blank=True)  # e.g., connection string
    target_model = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True)
    wind_farm = models.ForeignKey(
        WindFarm, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='import_jobs'
    )
    solar_farm = models.ForeignKey(
        SolarFarm, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='import_jobs'
    )
    is_continuous = models.BooleanField(default=False)
    interval_minutes = models.PositiveIntegerField(default=10, help_text="Interval for continuous imports in minutes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def clean(self):
        if self.wind_farm and self.solar_farm:
            raise ValidationError("Cannot select both wind farm and solar farm")
        if not self.wind_farm and not self.solar_farm:
            raise ValidationError("Must select either wind farm or solar farm")
        
        # Set target_model based on farm type during validation
        if self.wind_farm:
            self.target_model = ContentType.objects.get(app_label='timeseries', model='windfarmtimeseries')
        elif self.solar_farm:
            self.target_model = ContentType.objects.get(app_label='timeseries', model='solarfarmtimeseries')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ColumnMapping(models.Model):
    import_job = models.ForeignKey(
        ImportJob, 
        related_name='mappings', 
        on_delete=models.CASCADE
    )
    source_column = models.CharField(max_length=100, help_text="Column name from the source data")
    target_field = models.CharField(max_length=100, help_text="Field name in the target model")

    def __str__(self):
        return f"{self.source_column} → {self.target_field}"
