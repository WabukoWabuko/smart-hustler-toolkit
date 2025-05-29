from django.urls import path
from .views import TestAPIView, ParseSMSAPIView, TransactionListAPIView, InvoiceAPIView, InvoicePDFAPIView, TaxReportAPIView, TaxReportPDFAPIView, RegisterAPIView, LoginAPIView

app_name = 'core'

urlpatterns = [
    path('test/', TestAPIView.as_view(), name='test_api'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('parse-sms/', ParseSMSAPIView.as_view(), name='parse_sms'),
    path('transactions/', TransactionListAPIView.as_view(), name='transaction_list'),
    path('invoices/', InvoiceAPIView.as_view(), name='invoice_list'),
    path('invoices/<int:invoice_id>/pdf/', InvoicePDFAPIView.as_view(), name='invoice_pdf'),
    path('tax-reports/', TaxReportAPIView.as_view(), name='tax_report_list'),
    path('tax-reports/<int:report_id>/pdf/', TaxReportPDFAPIView.as_view(), name='tax_report_pdf'),
]
