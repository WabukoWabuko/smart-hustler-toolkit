from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from .utils import parse_mpesa_sms
from .models import Transaction, Invoice
from .serializers import TransactionSerializer, InvoiceSerializer

# Test endpoint
class TestAPIView(APIView):
    def get(self, request):
        return Response({"message": "Yo, Django is up and running!"}, status=status.HTTP_200_OK)

# Parse SMS
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

# Fetch transactions
class TransactionListAPIView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        category_id = request.query_params.get('category_id')
        if category_id:
            transactions = transactions.filter(category_id=category_id)
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
            transactions = transactions.filter(date__gte=start_date)
        if end_date:
            transactions = transactions.filter(date__lte=end_date)
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Create and fetch invoices
class InvoiceAPIView(APIView):
    def get(self, request):
        invoices = Invoice.objects.all()
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Generate and download invoice PDF
class InvoicePDFAPIView(APIView):
    def get(self, request, invoice_id):
        try:
            invoice = Invoice.objects.get(id=invoice_id)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
        
        html_string = render_to_string('invoice_template.html', {
            'invoice_number': invoice.invoice_number,
            'client_name': invoice.client_name,
            'client_email': invoice.client_email,
            'amount': invoice.amount,
            'description': invoice.description,
            'created_at': invoice.created_at
        })
        html = HTML(string=html_string)
        pdf = html.write_pdf()
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
        response.write(pdf)
        return response
