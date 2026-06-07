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
        # FIXED: Menggunakan 'proof_of_payment' agar sinkron dengan database & frontend payload
        fields = ['id', 'payment_date', 'amount_paid', 'proof_of_payment', 'is_verified']


class ActiveLoanDetailSerializer(serializers.ModelSerializer):
    repayments = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()

    class Meta:
        model = ActiveLoan
        fields = [
            'id', 'amount_disbursed', 'margin_amount', 'total_repayment', 
            'monthly_installment', 'tenor_months', 'due_date', 'is_fully_paid', 
            'repayments', 'remaining_amount', 'total_paid'
        ]
    
    def get_repayments(self, obj):
        # Solusi Aman: Query langsung ke model LoanRepayment menggunakan instance active_loan terkait
        logs = LoanRepayment.objects.filter(active_loan=obj).order_by('-payment_date', '-id')
        return LoanRepaymentSerializer(logs, many=True).data

    def get_total_paid(self, obj):
        # Solusi Aman: Filter data langsung ke model LoanRepayment untuk versi hitung total bayar
        verified_payments = LoanRepayment.objects.filter(active_loan=obj, is_verified=True)
        return sum(payment.amount_paid for payment in verified_payments)
    
    def get_remaining_amount(self, obj):
        paid = self.get_total_paid(obj)
        remaining = float(obj.total_repayment) - float(paid)
        return max(0.00, remaining)

class UploadRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        # FIXED: Menggunakan 'proof_of_payment' agar klop mendeteksi kiriman file dari React
        fields = ['amount_paid', 'proof_of_payment']