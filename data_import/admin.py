from django.contrib import admin
from .models import ImportJob, ColumnMapping

class ColumnMappingInline(admin.TabularInline):
    model = ColumnMapping
    extra = 1

@admin.register(ImportJob)
class ImportJobAdmin(admin.ModelAdmin):
    list_display = ('name', 'source_type', 'target_model', 'is_active', 'created_at', 'updated_at')
    list_filter = ('source_type', 'is_active', 'target_model')
    search_fields = ('name', 'target_model')
    inlines = [ColumnMappingInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'source_type', 'file', 'db_connection', 'target_model', 'wind_farm', 'solar_farm', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
