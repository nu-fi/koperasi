from django.contrib import admin
from .models import Member, Token  # Use relative import .models

admin.site.register(Member)
admin.site.register(Token)