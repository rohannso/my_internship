import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Add your own styles for the login form
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        console.log('Login successful');
        navigate('/dashboard'); // Redirect after login
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div>
      <div className='title'>Login Page</div>
      <div className="login-container">
        <div className="login-modal">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter a valid email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                placeholder="Enter a password"
              />
            </div>

            <button type="submit" className="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>

          <div className="create-account">
            <button type="button" onClick={handleCreateAccount}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
