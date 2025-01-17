import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Add styles for your home page
import vitiligoImage from '../assets/vitiligo.jpg'; // Import the image

const Home = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  const handleCheckClick = () => {
    navigate('/Form'); // Navigate to login page
  };


  return (
    <div className="container">
      <button className="login-button" onClick={handleLoginClick}>
        Login
      </button>
      <div className="header-rectangle">
        <h1 className="title">Vitiligo Detection</h1>
        <div className="content-container">
          <div className="description">
            <p>
              Vitiligo is a skin condition where the pigment-producing cells (melanocytes) are destroyed, resulting in the appearance of white patches of skin. This condition can occur anywhere on the body and affects both men and women.
            </p>
          </div>
          <div className="image">
            <img src={vitiligoImage} alt="Vitiligo" className="image" />
          </div>
        </div>
        <button className='check' onClick={handleCheckClick}>
          Get youself checked today!
        </button>
      </div>
    </div>
  );
};

export default Home;
