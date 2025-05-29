from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import parse_mpesa_sms
from .models import Transaction
from .serializers import TransactionSerializer

# Test endpoint
class TestAPIView(APIView):
    def get(self, request):
        return Response({"message": "Yo, Django is up and running!"}, status=status.HTTP_200_OK)

# Parse SMS and save transaction
class ParseSMSAPIView(APIView):
    def post(self, request):
        sms_text = request.data.get('sms_text')
        if not sms_text:
            return Response({"error": "SMS text is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        parsed_data = parse_mpesa_sms(sms_text)
        if not parsed_data:
            return Response({"error": "Invalid M-Pesa SMS format"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = TransactionSerializer(data=parsed_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Fetch transactions with filters
class TransactionListAPIView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        # Filter by category if provided
        category_id = request.query_params.get('category_id')
        if category_id:
            transactions = transactions.filter(category_id=category_id)
        # Filter by date range if provided
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
            transactions = transactions.filter(date__gte=start_date)
        if end_date:
            transactions = transactions.filter(date__lte=end_date)
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
