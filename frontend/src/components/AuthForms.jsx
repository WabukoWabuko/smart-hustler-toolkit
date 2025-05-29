import { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

function AuthForms({ type }) {
  const { login, register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (type === 'login') {
      const success = await login(formData.username, formData.password);
      if (success) {
        setSuccess('Logged in successfully!');
      } else {
        setError('Invalid credentials');
      }
    } else {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        setSuccess('Registered successfully!');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="card p-4 mt-4">
      <h3>{type === 'login' ? 'Login' : 'Register'}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {type === 'register' && (
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
        )}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {type === 'login' ? 'Login' : 'Register'}
        </Button>
      </Form>
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
}

export default AuthForms;
