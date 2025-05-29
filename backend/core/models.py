from django.db import models

# Define our Transaction model to store M-Pesa SMS data
class Transaction(models.Model):
    transaction_code = models.CharField(max_length=10, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    sender = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_code} - {self.amount} from {self.sender}"
