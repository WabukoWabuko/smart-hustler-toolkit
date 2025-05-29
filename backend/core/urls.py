from django.urls import path
from .views import TestAPIView, ParseSMSAPIView, TransactionListAPIView

app_name = 'core'

urlpatterns = [
    path('test/', TestAPIView.as_view(), name='test_api'),
    path('parse-sms/', ParseSMSAPIView.as_view(), name='parse_sms'),
    path('transactions/', TransactionListAPIView.as_view(), name='transaction_list'),
]
