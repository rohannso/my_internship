// Navbar.js
import React,{ useState, useEffect }  from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Navbar.css';  // Ensure you have styles for your navbar

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authCredentials = localStorage.getItem('authCredentials');
    setIsAuthenticated(!!authCredentials);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('authCredentials');
    localStorage.removeItem('userId');
    localStorage.removeItem('email')
    setIsAuthenticated(false);
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <ul>
        {/* Add other links as necessary */}
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          {isAuthenticated ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
