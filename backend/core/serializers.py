from rest_framework import serializers
from .models import Transaction, Category, Invoice

# Serialize Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

# Serialize Transaction
class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )

    class Meta:
        model = Transaction
        fields = ['transaction_code', 'amount', 'sender', 'phone_number', 'date', 'category', 'category_id']

# Serialize Invoice
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['invoice_number', 'client_name', 'client_email', 'amount', 'description', 'created_at']
