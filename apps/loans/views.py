from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, permissions
from rest_framework.views import APIView
# from .models import ActiveLoan as Loan
from .serializers import LoanSerializer, LoanApplicationSerializer, ActiveLoanDetailSerializer
from .models import LoanApplication, Member, ActiveLoan

@api_view(['GET'])
def get_loans(request):
    loans = ActiveLoan.objects.all()
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)

class ApplyLoanView(generics.CreateAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        member_instance = Member.objects.get(user=self.request.user)        
        serializer.save(member=member_instance)

class CheckActiveLoanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Ambil pengajuan TERAKHIR milik user
        latest_loan = LoanApplication.objects.filter(member__user=request.user).last()

        if latest_loan:
            # Kirim statusnya (pending, approved, rejected, disbursed, atau paid)
            return Response({"status": latest_loan.status})
        else:
            return Response({"status": None})

class MyLoanApplicationsView(generics.ListAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return loans belonging to the user, newest first
        return LoanApplication.objects.filter(member__user=self.request.user).order_by('-application_date')
    
class MyRepaymentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Ambil ActiveLoan milik user yang belum lunas
        active_loan = ActiveLoan.objects.filter(
            member__user=request.user, 
            is_fully_paid=False
        ).first()
        
        if not active_loan:
             return Response({"error": "Tidak ada tagihan aktif."}, status=404)

        # --- FIX: GUNAKAN SERIALIZER, BUKAN MANUAL DICTIONARY ---
        # Serializer ini yang punya logika 'get_remaining_amount' dan 'repayments'
        serializer = ActiveLoanDetailSerializer(active_loan)
        
        return Response(serializer.data)
        
