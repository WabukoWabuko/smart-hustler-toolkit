import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap'; // Fixed import

function SMSInputForm() {
  const [smsText, setSmsText] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post('http://localhost:8000/api/parse-sms/', { sms_text: smsText });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="card p-4">
      <h3>Parse M-Pesa SMS</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Enter M-Pesa SMS</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="e.g., XYZ123456 Confirmed. You have received KSh1,000 from John Doe 0712345678 on 29/5/25 at 7:20 PM"
          />
        </Form.Group>
        <Button variant="primary" type="submit">Parse SMS</Button>
      </Form>
      {response && (
        <Alert variant="success" className="mt-3">
          <h5>Parsed Transaction</h5>
          <p>Code: {response.transaction_code}</p>
          <p>Amount: KSh {response.amount}</p>
          <p>Sender: {response.sender}</p>
          <p>Phone: {response.phone_number}</p>
          <p>Date: {new Date(response.date).toLocaleString()}</p>
        </Alert>
      )}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
}

export default SMSInputForm;
