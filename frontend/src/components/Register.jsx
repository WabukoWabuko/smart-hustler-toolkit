import { useState } from 'react';
import axios from 'axios';

function Register({ setToken, setShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        username,
        password,
      });
      setToken(response.data.access_token);
      setShowRegister(false);
      setError(null);
    } catch (err) {
      setError('Registration failed. Username may already exist.');
    }
  };

  return (
    <div className="auth-container">
      <div className="card p-4 shadow-lg auth-card">
        <h3 className="text-center mb-4">Create Your Account</h3>
        <p className="text-center text-muted mb-4">Join Smart Hustler Toolkit to track your finances</p>
        <div className="mb-3">
          <label className="form-label fw-bold">Username</label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
        </div>
        <div className="mb-4">
          <label className="form-label fw-bold">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
          />
        </div>
        <button className="btn btn-primary btn-lg w-100 mb-3" onClick={handleRegister}>
          Register
        </button>
        <button className="btn btn-outline-secondary btn-lg w-100" onClick={() => setShowRegister(false)}>
          Back to Login
        </button>
        {error && <p className="text-danger text-center mt-3">{error}</p>}
      </div>
    </div>
  );
}

export default Register;
