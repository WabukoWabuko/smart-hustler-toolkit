from django.urls import path
from .views import TestAPIView, ParseSMSAPIView

app_name = 'core'

urlpatterns = [
    path('test/', TestAPIView.as_view(), name='test_api'),
    path('parse-sms/', ParseSMSAPIView.as_view(), name='parse_sms'),
]
