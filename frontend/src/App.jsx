import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import SMSInputForm from './components/SMSInputForm';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Test the backend connection
    axios.get('http://localhost:8000/api/test/')
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
    </div>
  );
}

export default App;
