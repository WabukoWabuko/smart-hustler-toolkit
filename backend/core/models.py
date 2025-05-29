from django.db import models

# Category model for grouping transactions
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

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

    def __str__(self):
        return f"{self.transaction_code} - {self.amount} from {self.sender}"
