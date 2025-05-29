import re
from datetime import datetime
from django.utils import timezone
from .models import Category

# Parse M-Pesa SMS and extract details
def parse_mpesa_sms(sms_text):
    pattern = r'(\w{10})\s+Confirmed\. You have received KSh([\d,]+\.?\d*)\s+from\s+([A-Z\s]+)\s+(\d{10})\s+on\s+(\d{1,2}/\d{1,2}/\d{2})\s+at\s+(\d{1,2}:\d{2}\s+[AP]M)'
    match = re.match(pattern, sms_text.strip())
    
    if not match:
        return None
    
    transaction_code, amount, sender, phone_number, date_str, time_str = match.groups()
    
    # Convert amount to float
    amount = float(amount.replace(',', ''))
    
    # Parse date and time
    date_time_str = f"{date_str} {time_str}"
    date_time = datetime.strptime(date_time_str, '%d/%m/%y %I:%M %p')
    date_time = timezone.make_aware(date_time, timezone.get_current_timezone())
    
    # Auto-categorize based on sender
    category = categorize_transaction(sender.strip())
    
    return {
        'transaction_code': transaction_code,
        'amount': amount,
        'sender': sender.strip(),
        'phone_number': phone_number,
        'date': date_time,
        'category': category
    }

# Assign category based on sender keywords
def categorize_transaction(sender):
    sender = sender.lower()
    if 'safaricom' in sender:
        return Category.objects.get_or_create(name='Airtime')[0]
    elif 'rent' in sender:
        return Category.objects.get_or_create(name='Rent')[0]
    else:
        return Category.objects.get_or_create(name='General')[0]
