import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [smsInput, setSmsInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/transactions');
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
    fetchTransactions();
  }, []);

  const handleParse = async () => {
    try {
      const response = await axios.post('http://localhost:3000/transactions/parse', {
        sms: smsInput,
      });
      setParsedData(response.data);
      setError(null);
      // Refresh transactions after parsing
      const transactionsResponse = await axios.get('http://localhost:3000/transactions');
      setTransactions(transactionsResponse.data);
    } catch (err) {
      console.error('Axios Error:', err);
      setError(err.message);
      setParsedData(null);
    }
  };

  // Prepare data for daily chart
  const dailyData = transactions.reduce((acc, tx) => {
    const date = new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    acc[date] = (acc[date] || 0) + (tx.type === 'Received' ? tx.amount : -tx.amount);
    return acc;
  }, {});
  const dailyChartData = {
    labels: Object.keys(dailyData),
    datasets: [
      {
        label: 'Daily Transactions (Ksh)',
        data: Object.values(dailyData),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
      },
    ],
  };

  // Prepare data for monthly chart
  const monthlyData = transactions.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + (tx.type === 'Received' ? tx.amount : -tx.amount);
    return acc;
  }, {});
  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Transactions (Ksh)',
        data: Object.values(monthlyData),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Smart Hustler Toolkit</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h3>Paste M-Pesa SMS</h3>
            <textarea
              className="form-control mb-3"
              rows="4"
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="Paste your M-Pesa SMS here"
            />
            <button className="btn btn-primary" onClick={handleParse}>
              Parse SMS
            </button>
            {parsedData && (
              <div className="mt-3">
                <h4>Parsed Result:</h4>
                <pre>{JSON.stringify(parsedData, null, 2)}</pre>
              </div>
            )}
            {error && (
              <div className="mt-3 text-danger">
                <h4>Error:</h4>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h3>Daily Transactions</h3>
            <Line
              data={dailyChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Daily Transaction Trends' } },
              }}
            />
          </div>
          <div className="card p-4">
            <h3>Monthly Transactions</h3>
            <Line
              data={monthlyChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Monthly Transaction Trends' } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
