from django.db import models
import django.utils.timezone
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
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='active_loans')
    loan_application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE, related_name='active_loan')

    amount_disbursed = models.DecimalField(max_digits=12, decimal_places=2) # The Principal (Pokok)
    tenor_months = models.PositiveIntegerField()
    disbursement_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    
    # --- ADD THESE NEW FIELDS ---
    margin_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0) # Keuntungan Koperasi
    total_repayment = models.DecimalField(max_digits=12, decimal_places=2, default=0) # Pokok + Margin
    monthly_installment = models.DecimalField(max_digits=12, decimal_places=2, default=0) # Angsuran per bulan
    
    is_fully_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Active Loan {self.id} for {self.member.user.first_name} {self.member.user.last_name}"
    
class LoanRepayment(models.Model):
    """
    Model representing a repayment made towards an active loan.
    """
    active_loan = models.ForeignKey(ActiveLoan, on_delete=models.CASCADE, related_name='repayments')
    # payment_date = models.DateField(auto_now_add=True)
    payment_date = models.DateField(default=django.utils.timezone.now)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    # payment_number = models.IntegerField(help_text="Sequential number of the payment made.")
    proof_of_payment = models.ImageField(upload_to='payments/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Repayment {self.id} for Loan {self.active_loan.id} - Amount: {self.amount_paid}"