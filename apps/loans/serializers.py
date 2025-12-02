from rest_framework import serializers
from .models import ActiveLoan, LoanApplication, LoanRepayment

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveLoan
        fields = '__all__'

class LoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = ['id', 'member', 'amount_requested', 'tenor_months_requested', 'purpose', 'status', 'application_date', 'approval_date']
        
        read_only_fields = ['member', 'status', 'application_date', 'approval_date']

class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = ['id', 'payment_date', 'amount_paid', 'proof_of_payment', 'is_verified']

class ActiveLoanDetailSerializer(serializers.ModelSerializer):
    repayments = LoanRepaymentSerializer(many=True, read_only=True)

    remaining_amount = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()

    class Meta:
        model = ActiveLoan
        fields =['id', 'amount_disbursed', 'margin_amount', 'total_repayment', 'monthly_installment', 'tenor_months', 'due_date', 'is_fully_paid', 'repayments', 'remaining_amount', 'total_paid', 'monthly_installment' ]
    
    def get_total_paid(self, obj):
        payments = obj.repayments.filter(is_verified=True)
        return sum(payment.amount_paid for payment in payments)
    
    def get_remaining_amount(self, obj):
        paid = self.get_total_paid(obj)
        return obj.total_repayment - paid