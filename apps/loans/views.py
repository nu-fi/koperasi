from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status 

from .serializers import LoanSerializer, LoanApplicationSerializer, ActiveLoanDetailSerializer, UploadRepaymentSerializer, LoanRepaymentSerializer
from .models import LoanApplication, Member, ActiveLoan, LoanRepayment

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
        # Ambil pengajuan TERAKHIR
        latest_loan = LoanApplication.objects.filter(member__user=request.user).last()

        if latest_loan:
            status_to_send = latest_loan.status
            
            # CEK TAMBAHAN: Jika statusnya 'disbursed', cek apakah sudah lunas di tabel ActiveLoan?
            if latest_loan.status == 'disbursed':
                try:
                    # Cek relasi ActiveLoan
                    if hasattr(latest_loan, 'active_loan') and latest_loan.active_loan.is_fully_paid:
                        status_to_send = 'paid' # Kita kirim status palsu 'paid' agar frontend tahu
                except Exception:
                    pass
            
            return Response({"status": status_to_send})
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
        

class UploadRepaymentProofView(APIView):
    permissions_classes = [permissions.IsAuthenticated]
    parses_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            active_loan = ActiveLoan.objects.get(member__user=request.user, is_fully_paid=False)
        except ActiveLoan.DoesNotExist:
            return Response({"error": "Tidak ada tagihan aktif."}, status=404)
        
        serializer = UploadRepaymentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(active_loan=active_loan, is_verified=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class LoanHistoryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ActiveLoanDetailSerializer # Atau buat serializer ringkas baru jika mau

    def get_queryset(self):
        # Ambil semua ActiveLoan milik user yang SUDAH LUNAS (is_fully_paid=True)
        return ActiveLoan.objects.filter(
            member__user=self.request.user, 
            is_fully_paid=True
        ).order_by('-disbursement_date')
    