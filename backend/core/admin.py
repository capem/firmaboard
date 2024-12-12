from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Define additional fields to be displayed in the admin interface
    fieldsets = UserAdmin.fieldsets + (
        (None, {
            'fields': ('phone_number', 'company', 'address', 'date_of_birth', 'role')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'fields': ('phone_number', 'company', 'address', 'date_of_birth', 'role')
        }),
    )
    list_display = UserAdmin.list_display + ('phone_number', 'company', 'role', 'is_active', 'is_staff')
    list_filter = UserAdmin.list_filter + ('company', 'role', 'is_staff', 'is_active')
    search_fields = UserAdmin.search_fields + ('phone_number', 'company__name', 'address', 'first_name', 'last_name')
    readonly_fields = ('last_login', 'date_joined')
    
    # list_display = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'company', 'role', 'is_staff', 'is_active')

    # Optional: Customize ordering
    ordering = ('username',)
