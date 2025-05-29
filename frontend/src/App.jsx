import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import SMSInputForm from './components/SMSInputForm';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import TaxReportForm from './components/TaxReportForm';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Test backend connection
    axios.get(`${API_BASE_URL}/api/test/`)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Connection error:', error);
        setMessage('Failed to connect to the backend :(');
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Smart Hustler Toolkit</h1>
      <p className="text-center">Backend says: {message}</p>
      <SMSInputForm />
      <Dashboard />
      <InvoiceForm />
      <TaxReportForm />
    </div>
  );
}

export default App;
