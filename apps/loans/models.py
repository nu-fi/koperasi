from django.db import models
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from apps.users.models import Member

class LoanApplication(models.Model):
    """
    Model representing a loan application made by a member.
    """
    class LoanStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        DISBURSED = 'disbursed', 'Disbursed'

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='loan_applications')
    amount_requested = models.DecimalField(max_digits=10, decimal_places=2)
    tenor_months_requested = models.PositiveIntegerField()
    purpose = models.TextField()
    status = models.CharField(max_length=10, choices=LoanStatus.choices, default=LoanStatus.PENDING)
    application_date = models.DateField(auto_now_add=True)
    approval_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Loan Application {self.id} by {self.member} - {self.get_status_display()}"
    

class ActiveLoan(models.Model):
    """
    Model representing an active loan associated with a loan application.
    """
    loan_application = models.OneToOneField(
        LoanApplication, 
        on_delete=models.CASCADE, 
        related_name='active_loan'
    )
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    tenor_months = models.IntegerField(editable=False, blank=True, null=True)
    is_fully_paid = models.BooleanField(default=False)
    amount_disbursed = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0.00)
    margin_amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0.00)
    total_repayment = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0.00)
    monthly_installment = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0.00)
    due_date = models.DateField(blank=True, null=True, editable=False)
    disbursement_date = models.DateField(blank=True, null=True) # Exists in DB now!

    def save(self, *args, **kwargs):
        # 1. Inherit metadata from application
        app = self.loan_application
        self.member = app.member
        self.tenor_months = app.tenor_months_requested
        self.amount_disbursed = app.amount_requested

        # 2. Synchronize dates
        if app.approval_date:
            self.disbursement_date = app.approval_date
        elif not self.disbursement_date:
            self.disbursement_date = timezone.now().date()

        # Due Date is 1 month from initial disbursement for baseline cycle tracking
        self.due_date = self.disbursement_date + relativedelta(months=1)

        # 3. Perform 35% Sharia Flat Margin calculations
        principal = float(self.amount_disbursed)
        self.margin_amount = principal * 0.35
        self.total_repayment = principal + self.margin_amount
        
        if self.tenor_months > 0:
            self.monthly_installment = self.total_repayment / self.tenor_months
        else:
            self.monthly_installment = 0.00

        super().save(*args, **kwargs)

    def __str__(self):
        try:
            return f"Active Loan {self.id} for {self.member.user.first_name} {self.member.user.last_name}"
        except AttributeError:
            return f"Active Loan {self.id} for {self.member}"
    

class LoanRepayment(models.Model):
    """
    Model representing a repayment made towards an active loan.
    """
    active_loan = models.ForeignKey(ActiveLoan, on_delete=models.CASCADE, related_name='repayments')
    payment_date = models.DateField(default=timezone.now)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    proof_of_payment = models.ImageField(upload_to='payments/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Repayment {self.id} for Loan {self.active_loan.id} - Amount: {self.amount_paid}"