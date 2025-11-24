from rest_framework import serializers
from .models import ActiveLoan as Loan

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'