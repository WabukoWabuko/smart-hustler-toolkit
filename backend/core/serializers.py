from rest_framework import serializers
from .models import Transaction, Category

# Serialize Category for nested use
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

# Serialize Transaction with category
class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )

    class Meta:
        model = Transaction
        fields = ['transaction_code', 'amount', 'sender', 'phone_number', 'date', 'category', 'category_id']
