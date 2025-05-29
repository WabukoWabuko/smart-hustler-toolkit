import re
from datetime import datetime
from django.utils import timezone

# Parse M-Pesa SMS and extract key details
def parse_mpesa_sms(sms_text):
    pattern = r'(\w{10})\s+Confirmed\. You have received KSh([\d,]+\.?\d*)\s+from\s+([A-Z\s]+)\s+(\d{10})\s+on\s+(\d{1,2}/\d{1,2}/\d{2})\s+at\s+(\d{1,2}:\d{2}\s+[AP]M)'
    match = re.match(pattern, sms_text.strip())
    
    if not match:
        return None
    
    transaction_code, amount, sender, phone_number, date_str, time_str = match.groups()
    
    # Convert amount to float, remove commas
    amount = float(amount.replace(',', ''))
    
    # Parse date and time
    date_time_str = f"{date_str} {time_str}"
    date_time = datetime.strptime(date_time_str, '%d/%m/%y %I:%M %p')
    date_time = timezone.make_aware(date_time, timezone.get_current_timezone())
    
    return {
        'transaction_code': transaction_code,
        'amount': amount,
        'sender': sender.strip(),
        'phone_number': phone_number,
        'date': date_time
    }
