from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import parse_mpesa_sms
from .models import Transaction
from .serializers import TransactionSerializer

# Test endpoint from Phase 1
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
