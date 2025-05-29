from rest_framework import serializers
from .models import Transaction

# Serialize Transaction data for the API
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['transaction_code', 'amount', 'sender', 'phone_number', 'date']
