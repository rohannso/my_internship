import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const UserInputForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    date: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Analysis Results:', location.state);
    // Add your report generation and email sending logic here
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Patient Information Form</h1>
      
      <form onSubmit={handleSubmit} style={{ 
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Patient Information */}
          <div>
            <h2 style={{ marginBottom: '15px' }}>Patient Information</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>

              <div>
                <label htmlFor="age" style={{ display: 'block', marginBottom: '5px' }}>Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>

              <div>
                <label htmlFor="gender" style={{ display: 'block', marginBottom: '5px' }}>Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h2 style={{ marginBottom: '15px' }}>Recipient Information</h2>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Recipient's Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInputForm;
