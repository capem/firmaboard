from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.conf import settings
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import time
from typing import Optional
import sys
from dotenv import load_dotenv

# Load environment variables at the start
load_dotenv()

class Command(BaseCommand):
    help = 'Reset database, run migrations, and create superuser'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force reset without confirmation (use with caution)',
        )
        parser.add_argument(
            '--keep-migrations',
            action='store_true',
            help='Keep existing migration files',
        )
        parser.add_argument(
            '--retry-attempts',
            type=int,
            default=3,
            help='Number of connection retry attempts',
        )

    def connect_with_retry(self, dbname: str, retry_attempts: int) -> Optional[tuple[psycopg2.extensions.connection, psycopg2.extensions.cursor]]:
        """Attempt to connect to PostgreSQL with retries."""
        attempt = 0
        last_error = None

        while attempt < retry_attempts:
            try:
                conn = psycopg2.connect(
                    dbname=dbname,
                    user=os.getenv('POSTGRES_USER'),
                    password=os.getenv('POSTGRES_PASSWORD'),
                    host=os.getenv('POSTGRES_HOST'),
                    port=os.getenv('POSTGRES_PORT'),
                    connect_timeout=10
                )
                conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
                cursor = conn.cursor()
                return conn, cursor
            except psycopg2.Error as e:
                last_error = e
                attempt += 1
                if attempt < retry_attempts:
                    self.stdout.write(self.style.WARNING(
                        f'Connection attempt {attempt} failed. Retrying in 5 seconds...'
                    ))
                    time.sleep(5)

        self.stdout.write(self.style.ERROR(
            f'Failed to connect after {retry_attempts} attempts. Last error: {last_error}'
        ))
        return None

    def confirm_reset(self) -> bool:
        """Confirm database reset with user."""
        self.stdout.write(self.style.WARNING(
            '\nWARNING: This will PERMANENTLY DELETE your database and all its data!'
        ))
        if settings.DEBUG:
            self.stdout.write('Running in DEBUG mode')
        else:
            self.stdout.write(self.style.ERROR(
                'DANGER: Running in PRODUCTION mode!'
            ))
        
        confirm = input('\nAre you sure you want to continue? [y/N]: ').lower()
        return confirm == 'y'

    def clean_migrations(self):
        """Clean migration files from all apps while preserving __init__.py"""
        apps = [app.split('.')[-1] for app in settings.INSTALLED_APPS if not app.startswith('django.')]  # List of apps to clean migrations
        
        for app in apps:
            migrations_dir = os.path.join(app, 'migrations')
            if not os.path.exists(migrations_dir):
                continue

            self.stdout.write(f'Cleaning migration files for {app}...')
            for filename in os.listdir(migrations_dir):
                if filename != '__init__.py' and filename.endswith('.py'):
                    file_path = os.path.join(migrations_dir, filename)
                    try:
                        os.remove(file_path)
                        self.stdout.write(f'Removed migration file: {app}/{filename}')
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(
                            f'Could not remove migration file {app}/{filename}: {e}'
                        ))

    def handle(self, *args, **options):
        # Safety check for production environment
        if not settings.DEBUG and not options['force']:
            raise CommandError(
                'This command is disabled in production. Use --force to override (WITH CAUTION)'
            )

        # Get confirmation unless --force is used
        if not options['force'] and not self.confirm_reset():
            self.stdout.write('Operation cancelled.')
            return

        db_settings = settings.DATABASES['default']
        retry_attempts = options['retry_attempts']

        # Connect to default postgres database
        result = self.connect_with_retry('postgres', retry_attempts)
        if result is None:
            raise CommandError('Could not connect to PostgreSQL')
        
        conn, cursor = result

        try:
            # Drop and recreate the database
            db_name = db_settings['NAME']
            
            # Close existing connections to the target database
            self.stdout.write('Closing existing connections...')
            cursor.execute(f"""
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = %s
                AND pid <> pg_backend_pid()
            """, [db_name])

            # Drop database if exists
            self.stdout.write(f'Dropping database {db_name} if exists...')
            cursor.execute(f'DROP DATABASE IF EXISTS {db_name}')
            self.stdout.write(self.style.SUCCESS(f'Database {db_name} dropped successfully'))

            # Create new database with TimescaleDB extension
            self.stdout.write(f'Creating new database {db_name}...')
            cursor.execute(f'CREATE DATABASE {db_name}')
            
            # Connect to the new database to create TimescaleDB extension
            cursor.close()
            conn.close()
            
            # Connect to the new database
            result = self.connect_with_retry(db_name, retry_attempts)
            if result is None:
                raise CommandError('Could not connect to new database')
            conn, cursor = result
            
            # Create TimescaleDB extension
            self.stdout.write('Creating TimescaleDB extension...')
            cursor.execute('CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE')
            self.stdout.write(self.style.SUCCESS('TimescaleDB extension created successfully'))

        except psycopg2.Error as e:
            raise CommandError(f'Database operation failed: {e}')

        finally:
            cursor.close()
            conn.close()

        # Clean migrations if not keeping them
        if not options['keep_migrations']:
            self.clean_migrations()

        try:
            # Make migrations
            self.stdout.write('Making migrations...')
            for app in settings.INSTALLED_APPS:
                if '.' not in app:  # Skip django.contrib apps
                    call_command('makemigrations', app)
            
            # Apply migrations
            self.stdout.write('Applying migrations...')
            call_command('migrate')
            
            # Create superuser using environment variables
            User = get_user_model()
            if not User.objects.filter(username=os.getenv('DJANGO_SUPERUSER_USERNAME')).exists():
                self.stdout.write('Creating superuser...')
                User.objects.create_superuser(
                    username=os.getenv('DJANGO_SUPERUSER_USERNAME'),
                    email=os.getenv('DJANGO_SUPERUSER_EMAIL'),
                    password=os.getenv('DJANGO_SUPERUSER_PASSWORD')
                )
                self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
            else:
                self.stdout.write('Superuser already exists')

            # Create test data
            self.stdout.write('Creating test data...')
            call_command('create_test_data')
            
            self.stdout.write(self.style.SUCCESS('\nDatabase reset completed successfully!'))

        except Exception as e:
            raise CommandError(f'An error occurred during migration or superuser creation: {e}')