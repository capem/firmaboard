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
        db_settings = settings.DATABASES['default']
        attempt = 0
        last_error = None

        while attempt < retry_attempts:
            try:
                conn = psycopg2.connect(
                    dbname=dbname,
                    user=db_settings['USER'],
                    password=db_settings['PASSWORD'],
                    host=db_settings['HOST'],
                    port=db_settings['PORT'],
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

    def clean_migrations(self, migrations_dir: str):
        """Clean migration files while preserving __init__.py"""
        if not os.path.exists(migrations_dir):
            return

        self.stdout.write('Cleaning migration files...')
        for filename in os.listdir(migrations_dir):
            if filename != '__init__.py' and filename.endswith('.py'):
                file_path = os.path.join(migrations_dir, filename)
                try:
                    os.remove(file_path)
                    self.stdout.write(f'Removed migration file: {filename}')
                except Exception as e:
                    self.stdout.write(self.style.WARNING(
                        f'Could not remove migration file {filename}: {e}'
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

            # Create new database
            self.stdout.write(f'Creating new database {db_name}...')
            cursor.execute(f'CREATE DATABASE {db_name}')
            self.stdout.write(self.style.SUCCESS(f'Database {db_name} created successfully'))

        except psycopg2.Error as e:
            raise CommandError(f'Database operation failed: {e}')

        finally:
            cursor.close()
            conn.close()

        # Clean migrations if not keeping them
        if not options['keep_migrations']:
            migrations_dir = os.path.join('farms', 'migrations')
            self.clean_migrations(migrations_dir)

        try:
            # Make migrations
            self.stdout.write('Making migrations...')
            call_command('makemigrations')
            
            # Apply migrations
            self.stdout.write('Applying migrations...')
            call_command('migrate')
            
            # Create superuser
            User = get_user_model()
            if not User.objects.filter(username='admin').exists():
                self.stdout.write('Creating superuser...')
                password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin')
                User.objects.create_superuser(
                    username='admin',
                    email='saadatmani@yahoo.fr',
                    password=password
                )
                self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
            else:
                self.stdout.write('Superuser already exists')
            
            self.stdout.write(self.style.SUCCESS('\nDatabase reset completed successfully!'))

        except Exception as e:
            raise CommandError(f'An error occurred during migration or superuser creation: {e}')
