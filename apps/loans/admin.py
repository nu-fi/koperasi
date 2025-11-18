from django.contrib import admin
from .models import ActiveLoan, LoanApplication # Use relative import .models

admin.site.register(ActiveLoan)
admin.site.register(LoanApplication) # You probably want to register this too