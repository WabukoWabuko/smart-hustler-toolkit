import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [smsText, setSmsText] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/transactions/parse', { sms: smsText });
      setTransaction(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error parsing SMS');
      setTransaction(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Smart Hustler Toolkit</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="smsInput" className="form-label">
            Enter M-Pesa SMS
          </label>
          <textarea
            id="smsInput"
            className="form-control"
            rows="4"
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="e.g., QJ12345678 Confirmed. You have received Ksh1,000.00 from JOHN DOE..."
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Parse SMS
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {transaction && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Parsed Transaction</h5>
            <p><strong>Transaction Code:</strong> {transaction.transactionCode}</p>
            <p><strong>Type:</strong> {transaction.type}</p>
            <p><strong>Amount:</strong> Ksh {transaction.amount.toFixed(2)}</p>
            <p><strong>Sender:</strong> {transaction.sender}</p>
            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
