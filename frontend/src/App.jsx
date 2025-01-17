// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Upload from './components/Upload';
import Register from './components/Register';
import Form from './components/Form';
import Navbar from './components/Navbar';  // Import Navbar here
import About from './components/About';
import Contact from './components/Contact';
import Form2 from './components/Form2';
import Form3 from './components/Form3';
import Form4 from './components/Form4';
import Form5 from './components/Form5';
import Form6 from './components/Form6';
import Form7 from './components/Form7';
import RiskPredictionResults from './components/RiskPredictionResults';
import UserInputForm from './components/UserInputForm';

function App() {
  return (
    <Router>
      {/* Add Navbar component here */}
      <Navbar />
      
      <Routes>
        {/* Define the home page route */}
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/register" element={<Register />} />
        {/* Define the login page route */}
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form2" element={<Form2 />} />
        <Route path="/form3" element={<Form3 />} />
        <Route path="/form4" element={<Form4 />} />
        <Route path="/form5" element={<Form5 />} />
        <Route path="/form6" element={<Form6 />} />
        <Route path="/form7" element={<Form7 />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/risk-prediction" element={<RiskPredictionResults />} />
        <Route path="/user-input-form" element={<UserInputForm />} />
      </Routes>

    </Router>
  );
}

export default App;
