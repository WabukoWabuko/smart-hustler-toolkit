import { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });
      setToken(response.data.access_token);
      setError(null);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="card p-4 shadow-lg auth-card">
        <h3 className="text-center mb-4">Welcome Back!</h3>
        <p className="text-center text-muted mb-4">Log in to manage your M-Pesa transactions</p>
        <div className="mb-3">
          <label className="form-label fw-bold">Username</label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-4">
          <label className="form-label fw-bold">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button className="btn btn-primary btn-lg w-100 mb-3" onClick={handleLogin}>
          Log In
        </button>
        {error && <p className="text-danger text-center mt-3">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
