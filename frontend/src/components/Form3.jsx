import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Form3.css'; // Make sure this points to your CSS file

const Form3 = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { returnUrl: '/form3' } });
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
    question7: '',
    question8: '',
    question9: '',
    question10: ''
  });
  const [totalScore, setTotalScore] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false); // State to handle form submission
  const [prediction, setPrediction] = useState(''); // To display prediction (if any)
 

  const userId = localStorage.getItem("userId");

  const handleScoreChange = (event) => {
    const { name, value } = event.target;
    const numericValue = parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));

    // Update total score
    setTotalScore((prev) => {
      const currentAnswers = {
        ...formData,
        [name]: numericValue,
      };
      return Object.values(currentAnswers).reduce(
        (sum, val) => sum + (Number(val) || 0),
        0
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validate that all questions are answered
    const unansweredQuestions = Object.values(formData).some(
      (value) => value === ''
    );
    if (unansweredQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/submit_lifestyle_assessment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total_score: totalScore,
          user_id:userId
        }),
      });

      if (response.ok) {
        console.log('Form submitted successfully:', await response.json());
        setFormSubmitted(true); // Mark form as submitted

        // Here you can include a prediction logic based on score (for demonstration purposes, it's hardcoded)
        if (totalScore > 30) {
          setPrediction('High risk, consult a doctor for further evaluation.');
        } else if (totalScore > 15) {
          setPrediction('Moderate risk, consider lifestyle changes.');
        } else {
          setPrediction('Low risk, keep up the good work!');
        }

        setTimeout(() => {
          navigate('/form4'); // Redirect after 2 seconds
        }, 2000); // Redirect after a delay of 2 seconds
      } else {
        console.error('Error submitting form:', response.statusText);
        alert('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div>
      <h2>Lifestyle Factor Assessment</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Question 1 */}
          <div>
            <label>
              1. Do you often suppress natural urges (e.g., urination, defecation, sneezing)?
            </label>
            <div>
              <input
                type="radio"
                name="question1"
                value="0"
                checked={formData.question1 === 0}
                onChange={handleScoreChange}
              />{' '}
              Never
              <input
                type="radio"
                name="question1"
                value="1"
                checked={formData.question1 === 1}
                onChange={handleScoreChange}
              />{' '}
              Rarely
              <input
                type="radio"
                name="question1"
                value="3"
                checked={formData.question1 === 3}
                onChange={handleScoreChange}
              />{' '}
              Sometimes
              <input
                type="radio"
                name="question1"
                value="4"
                checked={formData.question1 === 4}
                onChange={handleScoreChange}
              />{' '}
              Often
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label>2. How often do you engage in heavy physical exercise (Ati Vyayama)?</label>
            <div>
              <input
                type="radio"
                name="question2"
                value="0"
                checked={formData.question2 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question2"
                value="1"
                checked={formData.question2 === 1}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question2"
                value="2"
                checked={formData.question2 === 2}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question2"
                value="3"
                checked={formData.question2 === 3}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <label>3. Do you sleep immediately after having lunch/dinner?</label>
            <div>
              <input
                type="radio"
                name="question3"
                value="0"
                checked={formData.question3 === 0}
                onChange={handleScoreChange}
              /> No
              <input
                type="radio"
                name="question3"
                value="10"
                checked={formData.question3 === 10}
                onChange={handleScoreChange}
              /> Yes
            </div>
          </div>

          {/* Question 4 */}
          <div>
            <label>4. Do you often sleep during the day (Diwaswapan)?</label>
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
                value="4"
                checked={formData.question4 === 4}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question4"
                value="5"
                checked={formData.question4 === 5}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Question 5 */}
          <div>
            <label>5. How often do you feel physically or mentally exhausted (Ati Santapa)?</label>
            <div>
              <input
                type="radio"
                name="question5"
                value="0"
                checked={formData.question5 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question5"
                value="1"
                checked={formData.question5 === 1}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question5"
                value="2"
                checked={formData.question5 === 2}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question5"
                value="3"
                checked={formData.question5 === 3}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Question 6 */}
          <div>
            <label>6. Do you suffer from insomnia or disturbed sleep at night?</label>
            <div>
              <input
                type="radio"
                name="question6"
                value="0"
                checked={formData.question6 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question6"
                value="1"
                checked={formData.question6 === 1}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question6"
                value="3"
                checked={formData.question6 === 3}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question6"
                value="4"
                checked={formData.question6 === 4}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Question 7 */}
          <div>
            <label>7. Do you engage in heavy workouts at the gym soon after a heavy meal?</label>
            <div>
              <input
                type="radio"
                name="question7"
                value="0"
                checked={formData.question7 === 0}
                onChange={handleScoreChange}
              /> No
              <input
                type="radio"
                name="question7"
                value="5"
                checked={formData.question7 === 5}
                onChange={handleScoreChange}
              /> Yes
            </div>
          </div>

          {/* Question 8 */}
          <div>
            <label>8. Do you consume heavy and highly nutritive food soon after fasting?</label>
            <div>
              <input
                type="radio"
                name="question8"
                value="0"
                checked={formData.question8 === 0}
                onChange={handleScoreChange}
              /> No
              <input
                type="radio"
                name="question8"
                value="5"
                checked={formData.question8 === 5}
                onChange={handleScoreChange}
              /> Yes
            </div>
          </div>

          {/* Question 9 */}
          <div>
            <label>9. Do you bathe in cold water immediately after coming from a hot environment?</label>
            <div>
              <input
                type="radio"
                name="question9"
                value="0"
                checked={formData.question9 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question9"
                value="1"
                checked={formData.question9 === 1}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question9"
                value="2"
                checked={formData.question9 === 2}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question9"
                value="3"
                checked={formData.question9 === 3}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Question 10 */}
          <div>
            <label>10. Do you eat when your mind is agitated by fear?</label>
            <div>
              <input
                type="radio"
                name="question10"
                value="0"
                checked={formData.question10 === 0}
                onChange={handleScoreChange}
              /> Never
              <input
                type="radio"
                name="question10"
                value="2"
                checked={formData.question10 === 2}
                onChange={handleScoreChange}
              /> Rarely
              <input
                type="radio"
                name="question10"
                value="3"
                checked={formData.question10 === 3}
                onChange={handleScoreChange}
              /> Sometimes
              <input
                type="radio"
                name="question10"
                value="4"
                checked={formData.question10 === 4}
                onChange={handleScoreChange}
              /> Often
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit">Submit Lifestyle Assessment</button>
        </form>

        {/* Display the score and prediction after form submission */}
        {formSubmitted && (
          <div className="result">
            <h3>Your Lifestyle Risk Score: {totalScore}</h3>
            {prediction && <h4>Prediction: {prediction}</h4>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form3;