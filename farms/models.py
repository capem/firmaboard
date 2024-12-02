from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Company(models.Model):
    name = models.CharField(max_length=200)
    registration_number = models.CharField(max_length=100, unique=True)
    address = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name


class WindTurbineModel(models.Model):
    # Basic Information
    manufacturer = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    year_of_release = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1980), MaxValueValidator(2100)],
        help_text="Year of model release",
    )

    # Power Specifications
    power_output = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Power output in kW",
        validators=[MinValueValidator(0)],
    )
    cut_in_speed = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        help_text="Cut-in wind speed in m/s",
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    cut_out_speed = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        help_text="Cut-out wind speed in m/s",
        validators=[MinValueValidator(10), MaxValueValidator(40)],
    )
    rated_wind_speed = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        help_text="Rated wind speed in m/s",
        null=True,
        blank=True,
        validators=[MinValueValidator(5), MaxValueValidator(30)],
    )
    survival_wind_speed = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        help_text="Maximum survival wind speed in m/s",
        null=True,
        blank=True,
        validators=[MinValueValidator(30), MaxValueValidator(100)],
    )

    # IEC Classification
    WIND_CLASS_CHOICES = [
        ("IA", "IEC IA"),
        ("IB", "IEC IB"),
        ("IC", "IEC IC"),
        ("IIA", "IEC IIA"),
        ("IIB", "IEC IIB"),
        ("IIC", "IEC IIC"),
        ("IIIA", "IEC IIIA"),
        ("IIIB", "IEC IIIB"),
        ("IIIC", "IEC IIIC"),
        ("S", "IEC S (Special)"),
    ]
    wind_class = models.CharField(
        max_length=4,
        choices=WIND_CLASS_CHOICES,
        null=True,
        blank=True,
        help_text="IEC Wind Class",
    )

    # Rotor Specifications
    rotor_diameter = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Rotor diameter in meters",
        validators=[MinValueValidator(20), MaxValueValidator(300)],
    )
    swept_area = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Swept area in m²",
        null=True,
        blank=True,
    )
    number_of_blades = models.PositiveIntegerField(
        default=3, validators=[MinValueValidator(2), MaxValueValidator(4)]
    )
    max_rotor_speed = models.DecimalField(
        max_digits=5,
        decimal_places=1,
        help_text="Maximum rotor speed in rpm",
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    # Generator Specifications
    GENERATOR_TYPES = [
        ("DFIG", "Doubly-Fed Induction Generator"),
        ("PMSG", "Permanent Magnet Synchronous Generator"),
        ("SCIG", "Squirrel Cage Induction Generator"),
        ("WRIG", "Wound Rotor Induction Generator"),
        ("OTHER", "Other"),
    ]
    generator_type = models.CharField(
        max_length=10, choices=GENERATOR_TYPES, null=True, blank=True
    )
    generator_voltage = models.DecimalField(
        max_digits=8,
        decimal_places=1,
        help_text="Generator voltage in V",
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )
    grid_frequency = models.CharField(
        max_length=10, default="50/60", help_text="Grid frequency in Hz"
    )

    # Tower Specifications
    hub_height = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Hub height in meters",
        validators=[MinValueValidator(20), MaxValueValidator(300)],
    )
    TOWER_TYPES = [
        ("STEEL", "Steel Tube"),
        ("HYBRID", "Hybrid"),
        ("CONCRETE", "Concrete"),
        ("LATTICE", "Lattice"),
        ("OTHER", "Other"),
    ]
    tower_type = models.CharField(
        max_length=10, choices=TOWER_TYPES, null=True, blank=True
    )

    # Weight Information
    nacelle_weight = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Nacelle weight in tonnes",
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    # Power Curve and Additional Data
    power_curve = models.JSONField(
        null=True,
        blank=True,
        help_text="Power curve data points as JSON: {'wind_speeds': [], 'power_output': []}",
    )

    # Deployment Options
    onshore_suitable = models.BooleanField(default=True)
    offshore_suitable = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["manufacturer", "model_name"]
        verbose_name = "Wind Turbine Model"
        verbose_name_plural = "Wind Turbine Models"
        indexes = [
            models.Index(fields=["manufacturer", "model_name"]),
            models.Index(fields=["power_output"]),
            models.Index(fields=["rotor_diameter"]),
        ]

    def __str__(self):
        return f"{self.manufacturer} - {self.model_name} ({self.power_output}kW)"

    def clean(self):
        from django.core.exceptions import ValidationError

        # Validate that cut_in_speed < rated_wind_speed < cut_out_speed
        if self.rated_wind_speed:
            if self.rated_wind_speed <= self.cut_in_speed:
                raise ValidationError(
                    "Rated wind speed must be greater than cut-in speed"
                )
            if self.rated_wind_speed >= self.cut_out_speed:
                raise ValidationError(
                    "Rated wind speed must be less than cut-out speed"
                )

        # Calculate swept area if not provided
        if not self.swept_area and self.rotor_diameter:
            import math

            self.swept_area = round(math.pi * (self.rotor_diameter / 2) ** 2, 2)

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class SolarPanelModel(models.Model):
    # Basic Information
    manufacturer = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    year_of_release = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1990), MaxValueValidator(2100)],
        help_text="Year of model release",
    )

    # Panel Type and Technology
    TECHNOLOGY_CHOICES = [
        ("MONO", "Monocrystalline"),
        ("POLY", "Polycrystalline"),
        ("THIN", "Thin-film"),
        ("PERC", "PERC"),
        ("BIFACIAL", "Bifacial"),
        ("HJT", "Heterojunction"),
        ("OTHER", "Other"),
    ]
    technology_type = models.CharField(
        max_length=10, choices=TECHNOLOGY_CHOICES, help_text="Panel technology type"
    )
    bifacial = models.BooleanField(
        default=False, help_text="Whether the panel can produce power from both sides"
    )
    half_cells = models.BooleanField(
        default=False, help_text="Whether the panel uses half-cut cell technology"
    )

    # Electrical Specifications
    power_output = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Power output in kW",
        validators=[MinValueValidator(0)],
    )
    power_tolerance = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Power tolerance in ± %",
        default=3.00,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    efficiency = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Panel efficiency percentage",
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    # Voltage Specifications
    max_system_voltage = models.PositiveIntegerField(
        default=1000,
        help_text="Maximum system voltage (V)",
        validators=[MinValueValidator(600), MaxValueValidator(1500)],
    )
    vmp = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Voltage at maximum power (Vmpp)",
        validators=[MinValueValidator(0)],
    )
    voc = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Open circuit voltage (Voc)",
        validators=[MinValueValidator(0)],
    )
    imp = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Current at maximum power (Impp)",
        validators=[MinValueValidator(0)],
    )
    isc = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Short circuit current (Isc)",
        validators=[MinValueValidator(0)],
    )

    # Temperature Characteristics
    temp_coefficient_pmax = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Temperature coefficient of Pmax (%/°C)",
        validators=[MinValueValidator(-1), MaxValueValidator(0)],
    )
    temp_coefficient_voc = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Temperature coefficient of Voc (%/°C)",
        validators=[MinValueValidator(-1), MaxValueValidator(0)],
    )
    temp_coefficient_isc = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Temperature coefficient of Isc (%/°C)",
        validators=[MinValueValidator(0), MaxValueValidator(1)],
    )
    nominal_operating_temp = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        help_text="Nominal Operating Cell Temperature (°C)",
        validators=[MinValueValidator(30), MaxValueValidator(60)],
    )

    # Physical Specifications
    length = models.DecimalField(
        max_digits=6, decimal_places=2, help_text="Length in millimeters"
    )
    width = models.DecimalField(
        max_digits=6, decimal_places=2, help_text="Width in millimeters"
    )
    depth = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Depth in millimeters"
    )
    weight = models.DecimalField(
        max_digits=6, decimal_places=2, help_text="Weight in kilograms"
    )
    frame_type = models.CharField(
        max_length=50, default="Aluminum", help_text="Frame material type"
    )
    front_glass_thickness = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        help_text="Front glass thickness in mm",
        default=3.2,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )

    # Certifications and Warranty
    certifications = models.JSONField(
        null=True, blank=True, help_text="List of certifications (e.g., IEC, UL)"
    )
    product_warranty = models.PositiveIntegerField(
        help_text="Product warranty in years",
        default=10,
        validators=[MinValueValidator(5), MaxValueValidator(30)],
    )
    performance_warranty = models.PositiveIntegerField(
        help_text="Performance warranty in years",
        default=25,
        validators=[MinValueValidator(10), MaxValueValidator(30)],
    )
    performance_warranty_degradation = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Annual power degradation percentage",
        default=0.55,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )

    # Mechanical Characteristics
    max_static_load_front = models.PositiveIntegerField(
        help_text="Maximum static front load (Pa)",
        null=True,
        blank=True,
        validators=[MinValueValidator(1000), MaxValueValidator(10000)],
    )
    max_static_load_back = models.PositiveIntegerField(
        help_text="Maximum static back load (Pa)",
        null=True,
        blank=True,
        validators=[MinValueValidator(1000), MaxValueValidator(10000)],
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["manufacturer", "model_name"]
        verbose_name = "Solar Panel Model"
        verbose_name_plural = "Solar Panel Models"
        indexes = [
            models.Index(fields=["manufacturer", "model_name"]),
            models.Index(fields=["power_output"]),
            models.Index(fields=["technology_type"]),
            models.Index(fields=["efficiency"]),
        ]

    def __str__(self):
        return f"{self.manufacturer} - {self.model_name} ({self.power_output}W)"

    def clean(self):
        from django.core.exceptions import ValidationError

        # Validate voltage relationships
        if self.vmp >= self.voc:
            raise ValidationError(
                "Voltage at maximum power must be less than open circuit voltage"
            )

        # Validate current relationships
        if self.imp >= self.isc:
            raise ValidationError(
                "Current at maximum power must be less than short circuit current"
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Farm(models.Model):
    name = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    location = models.CharField(max_length=200)
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
    )
    total_area = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Area in hectares"
    )
    commissioned_date = models.DateField(null=True, blank=True)
    nominal_power = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Nominal power in MW"
    )
    operational_status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class WindFarm(Farm):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="wind_farms"
    )
    turbine_model = models.ForeignKey(WindTurbineModel, on_delete=models.PROTECT)
    number_of_turbines = models.PositiveIntegerField()
    average_wind_speed = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        help_text="Average wind speed at hub height in m/s",
        null=True,
        blank=True,
    )
    layout_description = models.TextField(
        help_text="Description of turbine layout and spacing", blank=True
    )


class SolarFarm(Farm):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="solar_farms"
    )
    panel_model = models.ForeignKey(SolarPanelModel, on_delete=models.PROTECT)
    number_of_panels = models.PositiveIntegerField()
    tracking_system = models.BooleanField(
        default=False, help_text="Whether the panels have a solar tracking system"
    )
    tilt_angle = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(90)],
        help_text="Panel tilt angle in degrees",
    )
    azimuth_angle = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(360)],
        help_text="Panel azimuth angle in degrees",
    )
    array_configuration = models.TextField(
        help_text="Description of panel array configuration and spacing", blank=True
    )
