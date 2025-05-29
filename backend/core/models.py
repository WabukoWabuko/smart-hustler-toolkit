from django.db import models
from django.contrib.auth.models import User

# Category model for transaction grouping
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

# Transaction model with category link
class Transaction(models.Model):
    transaction_code = models.CharField(max_length=10, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    sender = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.transaction_code} - {self.amount} from {self.sender}"

# Invoice model for client billing
class Invoice(models.Model):
    invoice_number = models.CharField(max_length=20, unique=True)
    client_name = models.CharField(max_length=100)
    client_email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.client_name}"

# TaxReport model for KRA turnover tax
class TaxReport(models.Model):
    period_start = models.DateField()
    period_end = models.DateField()
    total_income = models.DecimalField(max_digits=12, decimal_places=2)
    tax_estimate = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Tax Report {self.period_start} to {self.period_end}"
