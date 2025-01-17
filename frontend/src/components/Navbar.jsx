// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Ensure you have styles for your navbar

const Navbar = () => {
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
      </ul>
    </nav>
  );
};

export default Navbar;
