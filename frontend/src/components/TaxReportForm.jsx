import { useState, useEffect } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

function TaxReportForm() {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: ''
  });
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch tax reports
    axios.get('http://localhost:8000/api/tax-reports/')
      .then(response => setReports(response.data))
      .catch(error => console.error('Error fetching reports:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('http://localhost:8000/api/tax-reports/', formData);
      setReports([...reports, res.data]);
      setSuccess('Tax report generated successfully!');
      setFormData({ start_date: '', end_date: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate report');
    }
  };

  const handleDownloadPDF = async (reportId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/tax-reports/${reportId}/pdf/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tax_report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    }
  };

  return (
    <div className="card p-4 mt-4">
      <h3>Generate Tax Report</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Start Date (YYYY-MM-DD)</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Date (YYYY-MM-DD)</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Generate Report</Button>
      </Form>
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <h4 className="mt-4">Tax Reports</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Period</th>
            <th>Total Income</th>
            <th>Tax Estimate</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.period_start} to {report.period_end}</td>
              <td>KSh {report.total_income}</td>
              <td>KSh {report.tax_estimate}</td>
              <td>{new Date(report.created_at).toLocaleDateString()}</td>
              <td>
                <Button variant="link" onClick={() => handleDownloadPDF(report.id)}>
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

export default TaxReportForm;
