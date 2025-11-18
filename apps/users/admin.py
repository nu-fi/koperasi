from django.contrib import admin
from .models import Member  # Use relative import .models

admin.site.register(Member)