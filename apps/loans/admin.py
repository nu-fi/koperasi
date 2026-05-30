from django.contrib import admin
from django.utils import timezone
from django.contrib import messages
from django.db import transaction
from dateutil.relativedelta import relativedelta
from .models import LoanApplication, ActiveLoan, LoanRepayment

@admin.action(description='ACTIVATE Selected Loans (Calculate Margin & Disburse)')
def activate_loan_action(modeladmin, request, queryset):
    success_count = 0
    already_active_count = 0
    skipped_not_pending_count = 0

    for application in queryset:
        if hasattr(application, 'active_loan'):
            already_active_count += 1
            continue
            
        if application.status != 'pending':
            skipped_not_pending_count += 1
            continue

        with transaction.atomic():
            # Cukup panggil create seminimal mungkin, logic kalkulasi 35% margin & tanggal
            # akan otomatis dijalankan oleh def save() di model ActiveLoan lu!
            ActiveLoan.objects.create(
                loan_application=application,
                disbursement_date=application.approval_date if application.approval_date else timezone.now().date()
            )

            # Update Application Status
            application.status = 'disbursed'
            application.save()
            
            success_count += 1

    if success_count > 0:
        modeladmin.message_user(request, f"Berhasil mengaktifkan {success_count} pembiayaan.", messages.SUCCESS)
    if already_active_count > 0:
        modeladmin.message_user(request, f"Lewati {already_active_count} data karena pinjaman sudah aktif.", messages.WARNING)
    if skipped_not_pending_count > 0:
        modeladmin.message_user(request, f"Lewati {skipped_not_pending_count} data karena statusnya bukan 'pending'.", messages.ERROR)


@admin.action(description='VERIFY Selected Payments (Advance Due Date)')
def verify_repayment_action(modeladmin, request, queryset):
    verified_count = 0
    already_verified_count = 0

    for repayment in queryset:
        if repayment.is_verified:
            already_verified_count += 1
            continue

        with transaction.atomic():
            # 1. Verifikasi pembayaran angsuran
            repayment.is_verified = True
            repayment.save()

            # 2. Geser tanggal jatuh tempo (due_date) di tabel ActiveLoan ke bulan berikutnya
            active_loan = repayment.active_loan
            active_loan.due_date = active_loan.due_date + relativedelta(months=1)
            
            # 3. Hitung total bayar terverifikasi untuk ngecek apakah sudah lunas total
            total_paid = sum(r.amount_paid for r in active_loan.loanrepayment_set.filter(is_verified=True))
            if total_paid >= active_loan.total_repayment:
                active_loan.is_fully_paid = True
                
            active_loan.save()
            verified_count += 1

    if verified_count > 0:
        modeladmin.message_user(request, f"Berhasil memverifikasi {verified_count} pembayaran angsuran.", messages.SUCCESS)
    if already_verified_count > 0:
        modeladmin.message_user(request, f"Abaikan {already_verified_count} data karena sudah terverifikasi.", messages.WARNING)


class ActiveLoanInline(admin.StackedInline):
    model = ActiveLoan
    can_delete = False
    verbose_name_plural = "Active Loan Details (Calculated)"
    readonly_fields = ('amount_disbursed', 'margin_amount', 'total_repayment', 'monthly_installment', 'due_date', 'disbursement_date')


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'member', 'amount_requested', 'tenor_months_requested', 'status', 'application_date']
    list_filter = ['status', 'application_date']
    search_fields = ['member__user__username', 'purpose']
    actions = [activate_loan_action]
    inlines = [ActiveLoanInline]


@admin.register(ActiveLoan)
class ActiveLoanAdmin(admin.ModelAdmin):
    list_display = ['id', 'member', 'total_repayment', 'monthly_installment', 'is_fully_paid', 'disbursement_date', 'due_date']
    readonly_fields = ('amount_disbursed', 'margin_amount', 'total_repayment', 'monthly_installment', 'due_date', 'tenor_months')


@admin.register(LoanRepayment)
class LoanRepaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'active_loan', 'payment_date', 'amount_paid', 'is_verified']
    list_filter = ['is_verified', 'payment_date']
    search_fields = ['active_loan__member__user__username']
    actions = [verify_repayment_action]