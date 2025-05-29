import { useState, useEffect } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

function InvoiceForm() {
  const [formData, setFormData] = useState({
    invoice_number: '',
    client_name: '',
    client_email: '',
    amount: '',
    description: ''
  });
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch invoices
    axios.get('http://localhost:8000/api/invoices/')
      .then(response => setInvoices(response.data))
      .catch(error => console.error('Error fetching invoices:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('http://localhost:8000/api/invoices/', formData);
      setInvoices([...invoices, res.data]);
      setSuccess('Invoice created successfully!');
      setFormData({ invoice_number: '', client_name: '', client_email: '', amount: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.errors || 'Failed to create invoice');
    }
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/invoices/${invoiceId}/pdf/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  };

  return (
    <div className="card p-4 mt-4">
      <h3>Create Invoice</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Invoice Number</Form.Label>
          <Form.Control
            type="text"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Client Name</Form.Label>
          <Form.Control
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Client Email</Form.Label>
          <Form.Control
            type="email"
            name="client_email"
            value={formData.client_email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount (KSh)</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Create Invoice</Button>
      </Form>
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <h4 className="mt-4">Invoices</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice.invoice_number}>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.client_name}</td>
              <td>KSh {invoice.amount}</td>
              <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
              <td>
                <Button variant="link" onClick={() => handleDownloadPDF(invoice.id)}>
                  Download PDF
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default InvoiceForm;
