import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { returnUrl: '/contact' } });
    }
  }, [navigate]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [user_id, setItem] =  localStorage.getItem("userId");
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await axios.post('http://localhost:8000/api/contact/', {
        name,
        email,
        message,
        user_id
      });

      setStatus('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-purple-600 mb-4 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-6">
          Have questions or need assistance? We'd love to hear from you!
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Message"
              required
            />
          </div>
          
          {status && (
            <div className={`mb-4 text-center ${
              status.includes('successfully') 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {status}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Or contact us directly at{' '}
            <a href="mailto:support@vitiligodetect.com" className="text-purple-600 underline">
              support@vitiligodetect.com
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            Phone: <span className="font-medium">+1 234 567 890</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;