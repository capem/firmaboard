from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, date
from random import uniform, choice, randint
from farms.models import (
    Company, 
    WindFarm, 
    SolarFarm, 
    WindTurbineModel, 
    SolarPanelModel
)
from timeseries.models import WindFarmTimeseries, SolarFarmTimeseries

class Command(BaseCommand):
    help = 'Creates test data for all models including TimescaleDB tables'

    def create_companies(self):
        companies = [
            {
                'name': 'GreenPower Solutions',
                'registration_number': 'GP123456',
                'contact_email': 'contact@greenpower.com',
                'contact_phone': '+1234567890',
                'address': '123 Green Street, Renewable City'
            },
            {
                'name': 'SunWind Energy',
                'registration_number': 'SW789012',
                'contact_email': 'info@sunwind.com',
                'contact_phone': '+1987654321',
                'address': '456 Solar Avenue, Wind Town'
            },
        ]
        
        created_companies = []
        for company_data in companies:
            company, created = Company.objects.get_or_create(
                registration_number=company_data['registration_number'],
                defaults=company_data
            )
            created_companies.append(company)
            action = 'Created' if created else 'Retrieved'
            self.stdout.write(f"{action} company: {company.name}")
        
        return created_companies

    def create_turbine_models(self):
        turbines = [
            {
                'manufacturer': 'WindTech',
                'model_name': 'WT-2000',
                'year_of_release': 2020,
                'power_output': 2000,  # 2MW
                'cut_in_speed': 3.0,
                'cut_out_speed': 25.0,
                'rated_wind_speed': 12.0,
                'survival_wind_speed': 70.0,
                'wind_class': 'IIA',
                'rotor_diameter': 90,
                'swept_area': 6361.73,  # Will be auto-calculated
                'number_of_blades': 3,
                'max_rotor_speed': 15.0,
                'generator_type': 'DFIG',
                'generator_voltage': 690,
                'grid_frequency': '50/60',
                'hub_height': 80,
                'tower_type': 'STEEL',
                'nacelle_weight': 80.5,
                'power_curve': {'wind_speeds': [3,4,5,6,7,8,9,10,11,12], 
                              'power_output': [0,100,250,500,850,1300,1650,1850,1950,2000]},
                'onshore_suitable': True,
                'offshore_suitable': False,
            },
            {
                'manufacturer': 'TurbinePro',
                'model_name': 'TP-3000',
                'year_of_release': 2021,
                'power_output': 3000,  # 3MW
                'cut_in_speed': 3.5,
                'cut_out_speed': 27.0,
                'rated_wind_speed': 13.0,
                'survival_wind_speed': 75.0,
                'wind_class': 'IB',
                'rotor_diameter': 110,
                'swept_area': 9503.32,  # Will be auto-calculated
                'number_of_blades': 3,
                'max_rotor_speed': 13.5,
                'generator_type': 'PMSG',
                'generator_voltage': 720,
                'grid_frequency': '50/60',
                'hub_height': 90,
                'tower_type': 'HYBRID',
                'nacelle_weight': 95.0,
                'power_curve': {'wind_speeds': [3,4,5,6,7,8,9,10,11,12,13], 
                              'power_output': [0,150,350,650,1050,1550,2000,2400,2700,2900,3000]},
                'onshore_suitable': True,
                'offshore_suitable': True,
            },
        ]
        
        created_turbines = []
        for turbine_data in turbines:
            turbine, created = WindTurbineModel.objects.get_or_create(
                manufacturer=turbine_data['manufacturer'],
                model_name=turbine_data['model_name'],
                defaults=turbine_data
            )
            created_turbines.append(turbine)
            action = 'Created' if created else 'Retrieved'
            self.stdout.write(f"{action} turbine model: {turbine.manufacturer} {turbine.model_name}")
        
        return created_turbines

    def create_panel_models(self):
        panels = [
            {
                'manufacturer': 'SolarTech',
                'model_name': 'ST-400W',
                'year_of_release': 2021,
                'power_output': 0.4,  # 400W in kW
                'length': 1750,  # converted to mm
                'width': 1050,   # converted to mm
                'depth': 40,     # converted to mm
                'weight': 21.5,
                'technology_type': 'MONO',
                'bifacial': False,
                'half_cells': True,
                'power_tolerance': 3.0,
                'efficiency': 20.5,
                'max_system_voltage': 1000,
                'vmp': 38.5,
                'voc': 46.2,
                'imp': 10.4,
                'isc': 11.2,
                'temp_coefficient_pmax': -0.35,
                'temp_coefficient_voc': -0.28,
                'temp_coefficient_isc': 0.05,
                'nominal_operating_temp': 45.0,
                'frame_type': 'Aluminum',
                'front_glass_thickness': 3.2,
                'product_warranty': 12,
                'performance_warranty': 25,
                'performance_warranty_degradation': 0.55,
                'max_static_load_front': 5400,
                'max_static_load_back': 2400,
            },
            {
                'manufacturer': 'PanelPro',
                'model_name': 'PP-500W',
                'year_of_release': 2022,
                'power_output': 0.5,  # 500W in kW
                'length': 2000,  # converted to mm
                'width': 1200,   # converted to mm
                'depth': 40,     # converted to mm
                'weight': 23.0,
                'technology_type': 'BIFACIAL',
                'bifacial': True,
                'half_cells': True,
                'power_tolerance': 3.0,
                'efficiency': 21.5,
                'max_system_voltage': 1500,
                'vmp': 40.5,
                'voc': 48.2,
                'imp': 12.4,
                'isc': 13.2,
                'temp_coefficient_pmax': -0.34,
                'temp_coefficient_voc': -0.27,
                'temp_coefficient_isc': 0.04,
                'nominal_operating_temp': 45.0,
                'frame_type': 'Aluminum',
                'front_glass_thickness': 3.2,
                'product_warranty': 15,
                'performance_warranty': 30,
                'performance_warranty_degradation': 0.45,
                'max_static_load_front': 5400,
                'max_static_load_back': 2400,
            },
        ]
        
        created_panels = []
        for panel_data in panels:
            panel, created = SolarPanelModel.objects.get_or_create(
                manufacturer=panel_data['manufacturer'],
                model_name=panel_data['model_name'],
                defaults=panel_data
            )
            created_panels.append(panel)
            action = 'Created' if created else 'Retrieved'
            self.stdout.write(f"{action} panel model: {panel.manufacturer} {panel.model_name}")
        
        return created_panels

    def create_farms(self, companies, turbines, panels):
        wind_farms = [
            {
                'name': 'Coastal Winds',
                'company': companies[0],
                'location': 'Coastal Region',
                'latitude': 41.5,
                'longitude': -8.5,
                'total_area': 150.5,
                'commissioned_date': date(2020, 6, 15),
                'nominal_power': 50.0,
                'turbine_model': turbines[0],
                'number_of_turbines': 25,
                'average_wind_speed': 8.5,
                'layout_description': 'Grid layout with 5x5 configuration',
                'operational_status': True,
            },
            {
                'name': 'Mountain Breeze',
                'company': companies[1],
                'location': 'Mountain Range',
                'latitude': 42.0,
                'longitude': -7.8,
                'total_area': 200.0,
                'commissioned_date': date(2021, 3, 10),
                'nominal_power': 75.0,
                'turbine_model': turbines[1],
                'number_of_turbines': 25,
                'average_wind_speed': 9.2,
                'layout_description': 'Linear layout along ridgeline',
                'operational_status': True,
            },
        ]

        solar_farms = [
            {
                'name': 'Desert Sun',
                'company': companies[0],
                'location': 'Desert Region',
                'latitude': 40.5,
                'longitude': -7.5,
                'total_area': 100.0,
                'commissioned_date': date(2021, 5, 20),
                'nominal_power': 30.0,
                'panel_model': panels[0],
                'number_of_panels': 75000,
                'tracking_system': True,
                'tilt_angle': 30.0,
                'azimuth_angle': 180.0,
                'array_configuration': 'Single axis tracking with 4.5m row spacing',
                'operational_status': True,
            },
            {
                'name': 'Valley Solar',
                'company': companies[1],
                'location': 'Valley Region',
                'latitude': 41.0,
                'longitude': -8.0,
                'total_area': 80.0,
                'commissioned_date': date(2022, 4, 1),
                'nominal_power': 25.0,
                'panel_model': panels[1],
                'number_of_panels': 50000,
                'tracking_system': True,
                'tilt_angle': 35.0,
                'azimuth_angle': 175.0,
                'array_configuration': 'Dual axis tracking with 5.0m row spacing',
                'operational_status': True,
            },
        ]

        created_wind_farms = []
        created_solar_farms = []

        for farm_data in wind_farms:
            farm, created = WindFarm.objects.get_or_create(
                name=farm_data['name'],
                defaults=farm_data
            )
            created_wind_farms.append(farm)
            action = 'Created' if created else 'Retrieved'
            self.stdout.write(f"{action} wind farm: {farm.name}")

        for farm_data in solar_farms:
            farm, created = SolarFarm.objects.get_or_create(
                name=farm_data['name'],
                defaults=farm_data
            )
            created_solar_farms.append(farm)
            action = 'Created' if created else 'Retrieved'
            self.stdout.write(f"{action} solar farm: {farm.name}")

        return created_wind_farms, created_solar_farms

    def create_timeseries_data(self, wind_farms, solar_farms):
        # Create data for the last 24 hours
        end_time = timezone.now()
        start_time = end_time - timedelta(hours=24)
        current_time = start_time

        while current_time <= end_time:
            for wind_farm in wind_farms:
                WindFarmTimeseries.objects.create(
                    time=current_time,
                    station=wind_farm,
                    wind_speed=uniform(2.0, 15.0),
                    wind_direction=uniform(0, 360),
                    power_output=uniform(100, 1000),
                    temperature=uniform(15, 25)
                )

            for solar_farm in solar_farms:
                SolarFarmTimeseries.objects.create(
                    time=current_time,
                    station=solar_farm,
                    solar_irradiance=uniform(200, 1000),
                    power_output=uniform(50, 500),
                    module_temperature=uniform(20, 40)
                )

            current_time += timedelta(minutes=15)

        self.stdout.write(
            self.style.SUCCESS(
                f'Created time series data from {start_time} to {end_time}'
            )
        )

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test data...')
        
        companies = self.create_companies()
        turbines = self.create_turbine_models()
        panels = self.create_panel_models()
        wind_farms, solar_farms = self.create_farms(companies, turbines, panels)
        self.create_timeseries_data(wind_farms, solar_farms)
        
        self.stdout.write(self.style.SUCCESS('Successfully created all test data')) 