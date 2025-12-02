from django.contrib import admin
from .models import ActiveLoan, LoanApplication # Use relative import .models
from django.contrib import admin
from django.utils import timezone
from django.contrib import messages
from django.db import transaction
from dateutil.relativedelta import relativedelta
from .models import LoanApplication, ActiveLoan, LoanRepayment

# --- 1. Define the Calculation Logic as an Action ---
@admin.action(description='ACTIVATE Selected Loans (Calculate Margin & Disburse)')
def activate_loan_action(modeladmin, request, queryset):
    # Configuration: 10% Margin per year (Flat)
    MARGIN_PERCENTAGE_PER_YEAR = 0.35 
    
    success_count = 0
    already_active_count = 0

    for application in queryset:
        # Check if already active to prevent duplicates
        if hasattr(application, 'active_loan'):
            already_active_count += 1
            continue

        # Use atomic transaction to ensure data safety
        with transaction.atomic():
            # A. Perform Calculations
            principal = float(application.amount_requested)
            months = application.tenor_months_requested
            years = months / 12

            # Margin = Principal * Rate * Years
            margin_amount = principal * MARGIN_PERCENTAGE_PER_YEAR * years
            
            # Total = Principal + Margin
            total_repayment = principal + margin_amount
            
            # Monthly = Total / Months
            monthly_installment = total_repayment / months

            # Due Date = Today + Tenor
            today = timezone.now().date()
            due_date = today + relativedelta(months=+months)

            # B. Create the ActiveLoan Record
            ActiveLoan.objects.create(
                member=application.member,
                loan_application=application,
                amount_disbursed=principal,
                tenor_months=months,
                margin_amount=margin_amount,
                total_repayment=total_repayment,
                monthly_installment=monthly_installment,
                due_date=due_date
            )

            # C. Update Application Status
            application.status = 'disbursed'
            application.save()
            
            success_count += 1

    # Feedback Message to Admin
    if success_count > 0:
        modeladmin.message_user(request, f"Successfully activated {success_count} loans.", messages.SUCCESS)
    if already_active_count > 0:
        modeladmin.message_user(request, f"Skipped {already_active_count} loans because they were already active.", messages.WARNING)


# --- 2. Create an Inline to see ActiveLoan details inside Application ---
class ActiveLoanInline(admin.StackedInline):
    model = ActiveLoan
    can_delete = False
    verbose_name_plural = "Active Loan Details (Calculated)"
    readonly_fields = ('amount_disbursed', 'margin_amount', 'total_repayment', 'monthly_installment', 'due_date')


# --- 3. Register the Admin ---
@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'member', 'amount_requested', 'tenor_months_requested', 'status', 'application_date']
    list_filter = ['status', 'application_date']
    search_fields = ['member__user__username', 'purpose']
    
    # Add the Action we created above
    actions = [activate_loan_action]
    
    # Add the Inline so you can see the calculation result immediately
    inlines = [ActiveLoanInline]

# Register ActiveLoan just in case you want to see the table separately
@admin.register(ActiveLoan)
class ActiveLoanAdmin(admin.ModelAdmin):
    list_display = ['id', 'member', 'total_repayment', 'monthly_installment', 'is_fully_paid']

@admin.register(LoanRepayment)
class LoanRepaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'active_loan', 'payment_date', 'amount_paid', 'is_verified']
    list_filter = ['is_verified', 'payment_date']
    search_fields = ['active_loan__member__user__username']

# admin.site.register(ActiveLoan)
# admin.site.register(LoanApplication) # You probably want to register this too