from django.urls import path
from .views import TestAPIView, ParseSMSAPIView, TransactionListAPIView, InvoiceAPIView, InvoicePDFAPIView

app_name = 'core'

urlpatterns = [
    path('test/', TestAPIView.as_view(), name='test_api'),
    path('parse-sms/', ParseSMSAPIView.as_view(), name='parse_sms'),
    path('transactions/', TransactionListAPIView.as_view(), name='transaction_list'),
    path('invoices/', InvoiceAPIView.as_view(), name='invoice_list'),
    path('invoices/<int:invoice_id>/pdf/', InvoicePDFAPIView.as_view(), name='invoice_pdf'),
]
