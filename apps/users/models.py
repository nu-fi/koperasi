from django.db import models
from django.contrib.auth.models import User

class Token(models.Model):
    """
    Model representing an authentication token for a user, with fields to track its creation, expiration, and usage status.
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    is_expired = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    

class Member(models.Model):
    """
    Model representing a member in the Koperasi system, extending the built-in User model, with additional fields specific to Koperasi members.
    """
    class MemberStatus(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        PENDING = 'pending', 'Pending Approval'
        REJECTED = 'rejected', 'Rejected'

    # Extending the built-in User model (handles username, password, email, first_name, last_name) with a one-to-one relationship
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    # Koperasi-specific fields
    member_id = models.CharField(max_length=20, unique=True, blank=True, null=True, help_text="Official member ID assigned by the Koperasi.")
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    ktp_number = models.CharField(max_length=16, blank=True, help_text="National ID number.", null=True)
    birth_date = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_joined = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=MemberStatus.choices, default=MemberStatus.PENDING)

    def __str__(self):
        return self.user.username or self.user.get_full_name + " - " + self.get_status_display()
