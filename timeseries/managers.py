from django.db import models
from django.utils import timezone
from datetime import timedelta

class TimeSeriesManager(models.Manager):
    def get_last_24_hours(self, station_id):
        end_time = timezone.now()
        start_time = end_time - timedelta(hours=24)
        return self.filter(
            station_id=station_id,
            time__range=(start_time, end_time)
        ).time_bucket('time', '1 hour')

    def get_daily_average(self, station_id, days=7):
        end_time = timezone.now()
        start_time = end_time - timedelta(days=days)
        return self.filter(
            station_id=station_id,
            time__range=(start_time, end_time)
        ).time_bucket('time', '1 day') 