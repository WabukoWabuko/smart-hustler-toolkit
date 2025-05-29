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
      setError('Invalid credentials');
    }
  };

  return (
    <div className="card p-4">
      <h3>Login</h3>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}

export default Login;
