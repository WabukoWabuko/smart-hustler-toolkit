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
    <div className="card p-4">
      <h3>Register</h3>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
        />
      </div>
      <button className="btn btn-primary me-2" onClick={handleRegister}>
        Register
      </button>
      <button className="btn btn-secondary" onClick={() => setShowRegister(false)}>
        Back to Login
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}

export default Register;
