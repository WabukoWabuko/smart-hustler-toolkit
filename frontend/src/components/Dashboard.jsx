import { useState, useEffect } from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap'; // Fixed import
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch transactions
    axios.get('http://localhost:8000/api/transactions/')
      .then(response => {
        setTransactions(response.data);
        const uniqueCategories = [...new Set(response.data.map(t => t.category?.name))].filter(Boolean);
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  // Prepare chart data
  const getChartData = () => {
    let labels = [];
    let data = [];

    if (activeTab === 'daily') {
      const dailyData = transactions.reduce((acc, t) => {
        const date = new Date(t.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + parseFloat(t.amount);
        return acc;
      }, {});
      labels = Object.keys(dailyData);
      data = Object.values(dailyData);
    } else if (activeTab === 'monthly') {
      const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        acc[month] = (acc[month] || 0) + parseFloat(t.amount);
        return acc;
      }, {});
      labels = Object.keys(monthlyData);
      data = Object.values(monthlyData);
    } else if (activeTab === 'category') {
      const categoryData = transactions.reduce((acc, t) => {
        const category = t.category?.name || 'Uncategorized';
        acc[category] = (acc[category] || 0) + parseFloat(t.amount);
        return acc;
      }, {});
      labels = Object.keys(categoryData);
      data = Object.values(categoryData);
    }

    return {
      labels,
      datasets: [{
        label: 'Amount (KSh)',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    };
  };

  return (
    <Card className="p-4 mt-4">
      <h3>Transaction Dashboard</h3>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="daily" title="Daily" />
        <Tab eventKey="monthly" title="Monthly" />
        <Tab eventKey="category" title="Category" />
      </Tabs>
      <Bar
        data={getChartData()}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Transactions` }
          }
        }}
      />
    </Card>
  );
}

export default Dashboard;
