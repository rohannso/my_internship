import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Add your own styles for the login form

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [credentials, setCredentials] = useState(null); // For storing login credentials
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make a POST request to the backend for login
      const response = await axios.post('http://localhost:8000/api/login/', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        console.log('Login successful');
        console.log('User ID:', response.data.userId)
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('email', email);
        // Save credentials and userId to localStorage
        localStorage.setItem('authCredentials', btoa(`${email}:${password}`));
        
        navigate('/'); // Redirect to the homepage or dashboard
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <div>
      <div className="title">Login Page</div>
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
