from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    LoanSerializer, 
    LoanApplicationSerializer, 
    ActiveLoanDetailSerializer, 
    UploadRepaymentSerializer, 
    LoanRepaymentSerializer
)
from .models import LoanApplication, Member, ActiveLoan, LoanRepayment

# --- 1. Get Active Loans List ---
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated]) # Added protection
def get_loans(request):
    loans = ActiveLoan.objects.all()
    serializer = ActiveLoanDetailSerializer(loans, many=True) # Standardized to Detail view
    return Response(serializer.data)


# --- 2. Submit New Application (Used by ApplyLoan.jsx) ---
class ApplyLoanView(generics.CreateAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            member_instance = Member.objects.get(user=self.request.user)        
            serializer.save(member=member_instance)
        except Member.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"error": "Akun Anda belum terdaftar sebagai anggota aktif koperasi."})


# --- 3. Check Dashboard Workflow Status ---
class CheckActiveLoanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch the absolute latest application for this member
        latest_loan = LoanApplication.objects.filter(member__user=request.user).last()

        if latest_loan:
            # Change variable name to current_status to avoid module name conflicts!
            current_status = latest_loan.status
            
            if latest_loan.status == 'disbursed':
                try:
                    if hasattr(latest_loan, 'active_loan') and latest_loan.active_loan.is_fully_paid:
                        current_status = 'paid'
                except Exception:
                    pass
            
            return Response({"status": current_status}, status=status.HTTP_200_OK)
        
        return Response({"status": None}, status=status.HTTP_200_OK)


# --- 4. User's Application History List ---
class MyLoanApplicationsView(generics.ListAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LoanApplication.objects.filter(member__user=self.request.user).order_by('-application_date')
    

# --- 5. Active Statement Invoice Screen ---
class MyRepaymentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        active_loan = ActiveLoan.objects.filter(
            member__user=request.user, 
            is_fully_paid=False
        ).first()
        
        if not active_loan:
            return Response({"error": "Tidak ada tagihan aktif."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ActiveLoanDetailSerializer(active_loan)
        return Response(serializer.data)
        

# --- 6. Upload Payment Slip Image Asset ---
class UploadRepaymentProofView(APIView):
    # FIXED: Corrected spelling configurations (Removed plural 's')
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            active_loan = ActiveLoan.objects.get(member__user=request.user, is_fully_paid=False)
        except ActiveLoan.DoesNotExist:
            return Response({"error": "Tidak ada tagihan aktif untuk mengunggah bukti."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UploadRepaymentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(active_loan=active_loan, is_verified=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

# --- 7. Paid Off History Archive ---
class LoanHistoryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ActiveLoanDetailSerializer

    def get_queryset(self):
        return ActiveLoan.objects.filter(
            member__user=self.request.user, 
            is_fully_paid=True
        ).order_by('-disbursement_date')