from django.db import models
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
    Model representing an active loan that has been approved and disbursed to a member.
    """
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='active_loans')
    loan_application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE, related_name='active_loan')

    amount_disbursed = models.DecimalField(max_digits=10, decimal_places=2)
    tenor_months = models.PositiveIntegerField()
    # interest_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Annual interest rate as a percentage.")
    disbursement_date = models.DateField(auto_now_add=True)
    is_fully_paid = models.BooleanField(default=False)
    due_date = models.DateField()

    def __str__(self):
        return f"Active Loan {self.id} for {self.member}"
    
class LoanRepayment(models.Model):
    """
    Model representing a repayment made towards an active loan.
    """
    active_loan = models.ForeignKey(ActiveLoan, on_delete=models.CASCADE, related_name='repayments')
    payment_date = models.DateField(auto_now_add=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_number = models.IntegerField(help_text="Sequential number of the payment made.")

    def __str__(self):
        return f"Repayment {self.id} for Loan {self.active_loan.id} - Amount: {self.amount_paid}"