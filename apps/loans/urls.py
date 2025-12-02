from django.urls import path
from . import views

urlpatterns = [
    path('loan/list/', views.get_loans, name='get_loans'),
    path('apply/', views.ApplyLoanView.as_view(), name='apply_loan'),
    path('status/', views.CheckActiveLoanView.as_view(), name='loan_status'),
    path('my-applications/', views.MyLoanApplicationsView.as_view(), name='my-loans'),
    path('repayment/detail/', views.MyRepaymentDetailView.as_view(), name='repayment-detail'),
]