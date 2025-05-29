import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [smsInput, setSmsInput] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const handleParse = () => {
    // Placeholder for SMS parsing logic
    setParsedData({ message: 'Parsing not implemented yet!' });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Smart Hustler Toolkit</h1>
      <div className="card p-4">
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
      </div>
    </div>
  );
}

export default App;
