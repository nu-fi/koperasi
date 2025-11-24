from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import ActiveLoan as Loan
from .serializers import LoanSerializer

@api_view(['GET'])
def get_loans(request):
    loans = Loan.objects.all()
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)