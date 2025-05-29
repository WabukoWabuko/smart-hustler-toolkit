from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from .utils import parse_mpesa_sms
from .models import Transaction, Invoice, TaxReport
from .serializers import TransactionSerializer, InvoiceSerializer, TaxReportSerializer
from django.db.models import Sum
from datetime import datetime

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

# Generate invoice PDF
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

# Create and fetch tax reports
class TaxReportAPIView(APIView):
    def get(self, request):
        reports = TaxReport.objects.all()
        serializer = TaxReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        if not start_date or not end_date:
            return Response({"error": "Start and end dates are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format (use YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)
        
        transactions = Transaction.objects.filter(date__range=[start_date, end_date])
        total_income = transactions.aggregate(Sum('amount'))['amount__sum'] or 0
        tax_estimate = total_income * 0.03  # 3% turnover tax
        
        report = TaxReport.objects.create(
            period_start=start_date,
            period_end=end_date,
            total_income=total_income,
            tax_estimate=tax_estimate
        )
        serializer = TaxReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Generate tax report PDF
class TaxReportPDFAPIView(APIView):
    def get(self, request, report_id):
        try:
            report = TaxReport.objects.get(id=report_id)
        except TaxReport.DoesNotExist:
            return Response({"error": "Tax report not found"}, status=status.HTTP_404_NOT_FOUND)
        
        html_string = render_to_string('tax_report_template.html', {
            'period_start': report.period_start,
            'period_end': report.period_end,
            'total_income': report.total_income,
            'tax_estimate': report.tax_estimate,
            'created_at': report.created_at
        })
        html = HTML(string=html_string)
        pdf = html.write_pdf()
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="tax_report_{report.id}.pdf"'
        response.write(pdf)
        return response
