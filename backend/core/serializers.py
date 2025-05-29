from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, Category, Invoice, TaxReport

# User registration serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# User profile serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

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

# Serialize TaxReport
class TaxReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxReport
        fields = ['id', 'period_start', 'period_end', 'total_income', 'tax_estimate', 'created_at']
