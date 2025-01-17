import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form5.css';

const Form5 = () => {
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
  });
  const [totalScore, setTotalScore] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleScoreChange = (event) => {
    const { name, value } = event.target;
    const numericValue = parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));

    // Update total score dynamically
    const currentAnswers = {
      ...formData,
      [name]: numericValue,
    };
    setTotalScore(Object.values(currentAnswers).reduce((sum, val) => sum + (Number(val) || 0), 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const unansweredQuestions = Object.values(formData).some((value) => value === '');
    if (unansweredQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/EnvironmentalAssessment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total_score: totalScore,
        }),
      });

      if (response.ok) {
        console.log('Form submitted successfully:', await response.json());
        setFormSubmitted(true);
      } else {
        console.error('Error submitting form:', response.statusText);
        alert('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  const handleNext = () => {
    navigate('/form6'); // Navigate to the next page or summary
  };

  return (
    <div>
      <h2>Environmental Factors Assessment</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Question 1 */}
          <div>
            <label>Are you exposed to chemicals or industrial pollutants at work?</label>
            <div>
              <input
                type="radio"
                name="question1"
                value="0"
                checked={formData.question1 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question1"
                value="1"
                checked={formData.question1 === 1}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question1"
                value="2"
                checked={formData.question1 === 2}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question1"
                value="3"
                checked={formData.question1 === 3}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label>Do you live or work in a highly polluted area?</label>
            <div>
              <input
                type="radio"
                name="question2"
                value="0"
                checked={formData.question2 === 0}
                onChange={handleScoreChange}
              /> No
              <input
                type="radio"
                name="question2"
                value="5"
                checked={formData.question2 === 5}
                onChange={handleScoreChange}
              /> Yes
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <label>Have you used any harsh chemicals or skin products in recent months?</label>
            <div>
              <input
                type="radio"
                name="question3"
                value="0"
                checked={formData.question3 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question3"
                value="2"
                checked={formData.question3 === 2}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question3"
                value="3"
                checked={formData.question3 === 3}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question3"
                value="4"
                checked={formData.question3 === 4}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Question 4 */}
          <div>
            <label>Do you frequently spend long hours in direct sunlight without skin protection?</label>
            <div>
              <input
                type="radio"
                name="question4"
                value="0"
                checked={formData.question4 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question4"
                value="2"
                checked={formData.question4 === 2}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question4"
                value="3"
                checked={formData.question4 === 3}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question4"
                value="4"
                checked={formData.question4 === 4}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-button-container">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>

        {/* Display the calculated Environmental Score upon form submission */}
        {formSubmitted && (
          <div className="score-container">
            <p>Environmental Score: {totalScore}</p>
          </div>
        )}

        {/* Next Button */}
        <div className="next-button-container">
          <button type="button" onClick={handleNext} className="next-button">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form5;
