from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class CustomUser(AbstractUser):
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message=_("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        null=True,
        help_text="Contact phone number"
    )
    company = models.ForeignKey(
        'farms.Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Company associated with the user"
    )
    address = models.TextField(
        blank=True,
        null=True,
        help_text="User's physical address"
    )
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('owner', 'Owner'),
        ('manager', 'Manager'),
        ('analyst', 'Analyst'),
        ('supervisor', 'Supervisor'),
        ('employee', 'Employee'),
    ]
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='employee',
        help_text="Role of the user within the company"
    )

    # Override the groups field to add a unique related_name
    groups = models.ManyToManyField(
        Group,
        blank=True,
        help_text="The groups this user belongs to.",
        related_name="customuser_set",
        related_query_name="customuser",
    )

    # Override the user_permissions field to add a unique related_name
    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="customuser_set_permissions",
        related_query_name="customuser_permission",
    )

    def __str__(self):
        return f"{self.username} ({self.get_full_name()})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    class Meta:
        verbose_name = "Custom User"
        verbose_name_plural = "Custom Users"
