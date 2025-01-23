import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form7.css';
const Form7 = () => {
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
    question7: '',
    question8: ''
  });
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { returnUrl: '/form7' } });
    }
  }, [navigate]);
  const userId = localStorage.getItem("userId");

  const handleScoreChange = (event, value) => {
    const { name } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));


    // Update total score
    setScore((prevScore) => {
      const updatedData = { ...formData, [name]: value };
      return Object.values(updatedData).reduce((sum, val) => sum + (Number(val) || 0), 0);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions are answered
    const unanswered = Object.values(formData).some((value) => value === '');
    if (unanswered) {
      alert('Please answer all the questions.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/vitiligo-assessment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          total_score: score,
          user_id:userId
        })
      });

      if (response.ok) {
        console.log('Form submitted successfully:', await response.json());
        alert('Form submitted successfully!');
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
    navigate('/risk-prediction');
  };

  return (
    <div>
      <h2>Vitiligo Progression Questionnaire</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Question 1 */}
          <div>
            <label>1. Do you have any white patches on your skin?</label>
            <div>
              <input
                type="radio"
                name="question1"
                value="1"
                checked={formData.question1 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Yes
              <input
                type="radio"
                name="question1"
                value="0"
                checked={formData.question1 === '0'}
                onChange={(e) => handleScoreChange(e, '0')}
              /> No
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label>2. What is the shape of the white patches?</label>
            <div>
              <input
                type="radio"
                name="question2"
                value="1"
                checked={formData.question2 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Round
              <input
                type="radio"
                name="question2"
                value="2"
                checked={formData.question2 === '2'}
                onChange={(e) => handleScoreChange(e, '2')}
              /> Oval
              <input
                type="radio"
                name="question2"
                value="3"
                checked={formData.question2 === '3'}
                onChange={(e) => handleScoreChange(e, '3')}
              /> Irregular
              <input
                type="radio"
                name="question2"
                value="0"
                checked={formData.question2 === '0'}
                onChange={(e) => handleScoreChange(e, '0')}
              /> Not sure
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <label>3. Are the white patches expanding over time?</label>
            <div>
              <input
                type="radio"
                name="question3"
                value="2"
                checked={formData.question3 === '2'}
                onChange={(e) => handleScoreChange(e, '2')}
              /> Yes, they are growing
              <input
                type="radio"
                name="question3"
                value="0"
                checked={formData.question3 === '0'}
                onChange={(e) => handleScoreChange(e, '0')}
              /> No, they have remained the same size
              <input
                type="radio"
                name="question3"
                value="1"
                checked={formData.question3 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Not sure
            </div>
          </div>

          {/* Question 4 */}
          <div>
            <label>4. How long have you had the white patches on your body?</label>
            <div>
              <input
                type="radio"
                name="question4"
                value="1"
                checked={formData.question4 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Less than 3 months
              <input
                type="radio"
                name="question4"
                value="2"
                checked={formData.question4 === '2'}
                onChange={(e) => handleScoreChange(e, '2')}
              /> 3-6 months
              <input
                type="radio"
                name="question4"
                value="3"
                checked={formData.question4 === '3'}
                onChange={(e) => handleScoreChange(e, '3')}
              /> 6-12 months
              <input
                type="radio"
                name="question4"
                value="4"
                checked={formData.question4 === '4'}
                onChange={(e) => handleScoreChange(e, '4')}
              /> More than 1 year
            </div>
          </div>

          {/* Question 5 */}
          <div>
            <label>5. Do you experience any sensations (e.g., itching, pain) in or around the white patches?</label>
            <div>
              <input
                type="radio"
                name="question5"
                value="1"
                checked={formData.question5 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Yes, itching
              <input
                type="radio"
                name="question5"
                value="2"
                checked={formData.question5 === '2'}
                onChange={(e) => handleScoreChange(e, '2')}
              /> Yes, pain
              <input
                type="radio"
                name="question5"
                value="0"
                checked={formData.question5 === '0'}
                onChange={(e) => handleScoreChange(e, '0')}
              /> No, no sensations
              <input
                type="radio"
                name="question5"
                value="1"
                checked={formData.question5 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Not sure
            </div>
          </div>

          {/* Question 6 */}
          <div>
            <label>6. Have the patches changed in color over time (e.g., from light to completely white)?</label>
            <div>
              <input
                type="radio"
                name="question6"
                value="2"
                checked={formData.question6 === '2'}
                onChange={(e) => handleScoreChange(e, '2')}
              /> Yes, they have lightened over time
              <input
                type="radio"
                name="question6"
                value="0"
                checked={formData.question6 === '0'}
                onChange={(e) => handleScoreChange(e, '0')}
              /> No, they have remained the same color
              <input
                type="radio"
                name="question6"
                value="1"
                checked={formData.question6 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Not sure
            </div>
          </div>

          {/* Question 7 */}
          <div>
            <label>7. Have you noticed any new white patches appearing recently?</label>
            <div>
              <input
                type="radio"
                name="question7"
                value="2"
                checked={formData.question7 === '2'}
                onChange={(e) => handleScoreChange(e, '2')}
              /> Yes, within the last 3 months
              <input
                type="radio"
                name="question7"
                value="0"
                checked={formData.question7 === '0'}
                onChange={(e) => handleScoreChange(e, '0')}
              /> No, no new patches
              <input
                type="radio"
                name="question7"
                value="1"
                checked={formData.question7 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Not sure
            </div>
          </div>

          {/* Question 8 */}
          <div>
            <label>8. Do the patches become more noticeable in sunlight or when your skin tans?</label>
            <div>
              <input
                type="radio"
                name="question8"
                value="2"
                checked={formData.question8 === '2'}
                onChange={(e) => handleScoreChange(e, '2')}
              /> Yes, they are more noticeable
              <input
                type="radio"
                name="question8"
                value="0"
                checked={formData.question8 === '0'}
                onChange={(e) => handleScoreChange(e, '0')}
              /> No, they don't change in the sun
              <input
                type="radio"
                name="question8"
                value="1"
                checked={formData.question8 === '1'}
                onChange={(e) => handleScoreChange(e, '1')}
              /> Not sure
            </div>
          </div>

          <div className="form-footer">
            <p>Total Score: {score}</p>
            <button type="submit">Submit Form</button>
            <button type="button" onClick={handleNext}>predict</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form7;
