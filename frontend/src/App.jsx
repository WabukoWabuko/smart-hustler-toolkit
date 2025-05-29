import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showRegister, setShowRegister] = useState(false);
  const [smsInput, setSmsInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch transactions on mount if authenticated
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchTransactions();
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    }
  };

  const handleParse = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/transactions/parse',
        { sms: smsInput },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setParsedData(response.data);
      setError(null);
      fetchTransactions(); // Refresh transactions
    } catch (err) {
      console.error('Axios Error:', err);
      setError(err.message);
      setParsedData(null);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-white');
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setTransactions([]);
    setParsedData(null);
    setError(null);
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
        backgroundColor: darkMode ? 'rgba(0, 123, 255, 0.4)' : 'rgba(0, 123, 255, 0.2)',
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
        backgroundColor: darkMode ? 'rgba(40, 167, 69, 0.4)' : 'rgba(40, 167, 69, 0.2)',
        fill: true,
      },
    ],
  };

  if (!token) {
    return (
      <div className={`auth-page ${darkMode ? 'bg-dark text-white' : 'bg-light'}`}>
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="col-md-4 auth-wrapper">
            {showRegister ? (
              <Register setToken={setToken} setShowRegister={setShowRegister} />
            ) : (
              <div>
                <Login setToken={setToken} />
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <button className="btn btn-link p-0 auth-link" onClick={() => setShowRegister(true)}>
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mt-5 ${darkMode ? 'bg-dark text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Smart Hustler Toolkit</h1>
        <div>
          <button className="btn btn-secondary me-2" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className={`card p-4 mb-4 ${darkMode ? 'bg-secondary text-white' : ''}`}>
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
                <pre className={darkMode ? 'bg-dark text-white' : ''}>{JSON.stringify(parsedData, null, 2)}</pre>
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
        <div className="col-md-8">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className={`card p-4 mb-4 ${darkMode ? 'bg-secondary text-white' : ''}`}>
                <h3>Daily Transactions</h3>
                <div className="chart-container">
                  <Line
                    data={dailyChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' }, title: { display: true, text: 'Daily Transaction Trends' } },
                    }}
                    height={300}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className={`card p-4 mb-4 ${darkMode ? 'bg-secondary text-white' : ''}`}>
                <h3>Monthly Transactions</h3>
                <div className="chart-container">
                  <Line
                    data={monthlyChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' }, title: { display: true, text: 'Monthly Transaction Trends' } },
                    }}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`card p-4 ${darkMode ? 'bg-secondary text-white' : ''}`}>
            <h3>Transaction History</h3>
            {transactions.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount (Ksh)</th>
                      <th>Sender</th>
                      <th>Transaction Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{new Date(tx.date).toLocaleDateString('en-GB')}</td>
                        <td>{tx.type}</td>
                        <td>{tx.amount.toFixed(2)}</td>
                        <td>{tx.sender}</td>
                        <td>{tx.transactionCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No transactions yet. Parse an SMS to add one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
