from django.contrib import admin
from .models import Company, WindFarm, SolarFarm, WindTurbineModel, SolarPanelModel


@admin.register(Company)
class CompanyDisplay(admin.ModelAdmin):
    list_display = ("name", "registration_number", "contact_email", "contact_phone")
    search_fields = ("name", "registration_number")


@admin.register(WindFarm)
class WindFarmDisplay(admin.ModelAdmin):
    list_display = (
        "name",
        "company",
        "location",
        "nominal_power",
        "turbine_model",
        "number_of_turbines",
        "operational_status",
    )
    list_filter = ("operational_status", "company", "turbine_model__manufacturer")
    search_fields = (
        "name",
        "location",
        "company__name",
        "turbine_model__manufacturer",
        "turbine_model__model_name",
    )
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "name",
                    "company",
                    "location",
                    "nominal_power",
                    "operational_status",
                )
            },
        ),
        ("Geographic Data", {"fields": ("latitude", "longitude", "total_area")}),
        (
            "Turbine Configuration",
            {
                "fields": (
                    "turbine_model",
                    "number_of_turbines",
                    "average_wind_speed",
                    "layout_description",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("commissioned_date", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(SolarFarm)
class SolarFarmDisplay(admin.ModelAdmin):
    list_display = (
        "name",
        "company",
        "location",
        "nominal_power",
        "panel_model",
        "number_of_panels",
        "operational_status",
    )
    list_filter = (
        "operational_status",
        "company",
        "tracking_system",
        "panel_model__manufacturer",
    )
    search_fields = (
        "name",
        "location",
        "company__name",
        "panel_model__manufacturer",
        "panel_model__model_name",
    )
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "name",
                    "company",
                    "location",
                    "nominal_power",
                    "operational_status",
                )
            },
        ),
        ("Geographic Data", {"fields": ("latitude", "longitude", "total_area")}),
        (
            "Panel Configuration",
            {
                "fields": (
                    "panel_model",
                    "number_of_panels",
                    "tracking_system",
                    "tilt_angle",
                    "azimuth_angle",
                    "array_configuration",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("commissioned_date", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(WindTurbineModel)
class WindTurbineModelDisplay(admin.ModelAdmin):
    list_display = (
        "manufacturer",
        "model_name",
        "power_output",
        "rotor_diameter",
        "hub_height",
        "wind_class",
        "onshore_suitable",
        "offshore_suitable",
    )
    list_filter = (
        "manufacturer",
        "wind_class",
        "generator_type",
        "tower_type",
        "onshore_suitable",
        "offshore_suitable",
    )
    search_fields = (
        "manufacturer",
        "model_name",
    )
    readonly_fields = ("created_at", "updated_at", "swept_area")
    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "manufacturer",
                    "model_name",
                    "year_of_release",
                    "wind_class",
                    ("onshore_suitable", "offshore_suitable"),
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Power & Performance",
            {
                "fields": (
                    "power_output",
                    ("cut_in_speed", "rated_wind_speed", "cut_out_speed"),
                    "survival_wind_speed",
                    "power_curve",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Mechanical Specifications",
            {
                "fields": (
                    "rotor_diameter",
                    "swept_area",
                    "number_of_blades",
                    "max_rotor_speed",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Electrical Specifications",
            {
                "fields": (
                    "generator_type",
                    "generator_voltage",
                    "grid_frequency",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Physical Specifications",
            {
                "fields": (
                    "tower_type",
                    "hub_height",
                    "nacelle_weight",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "System Information",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(SolarPanelModel)
class SolarPanelModelDisplay(admin.ModelAdmin):
    list_display = (
        "manufacturer",
        "model_name",
        "technology_type",
        "power_output",
        "efficiency",
    )
    list_filter = (
        "manufacturer",
        "technology_type",
    )
    search_fields = (
        "manufacturer",
        "model_name",
    )
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "manufacturer",
                    "model_name",
                    "year_of_release",
                    "technology_type",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Power & Performance",
            {
                "fields": (
                    "power_output",
                    "power_tolerance",
                    "efficiency",
                    "max_system_voltage",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Electrical Specifications",
            {
                "fields": (
                    ("vmp", "voc"),
                    ("imp", "isc"),
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Environmental Specifications",
            {
                "fields": (
                    "temp_coefficient_pmax",
                    "temp_coefficient_voc",
                    "temp_coefficient_isc",
                    "nominal_operating_temp",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Physical Specifications",
            {
                "fields": (
                    ("length", "width", "depth"),
                    "weight",
                    "frame_type",
                    "front_glass_thickness",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Certifications & Warranty",
            {
                "fields": (
                    "certifications",
                    "product_warranty",
                    "performance_warranty",
                    "performance_warranty_degradation",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Mechanical Specifications",
            {
                "fields": (
                    "max_static_load_front",
                    "max_static_load_back",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "System Information",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )
