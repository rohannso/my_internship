import React, { useState } from 'react';
import './Form4.css'; // Ensure this is the path to your CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed and imported


const userId = localStorage.getItem("userId");
const Form4 = () => {
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
    question10: '',
    user_id:userId

  });
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form is submitted
  const [finalScore, setFinalScore] = useState(null); // To hold the final score from the backend
  const navigate = useNavigate();


  // Function to handle changes in form inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents default form submission behavior
    try {
      // Send form data to the backend (adjust the URL based on your backend endpoint)
      const response = await axios.post('http://localhost:8000/api/submit_psychological_assessment/', formData);

      // Get the final score from the backend response
      setFinalScore(response.data.total_score);
      setFormSubmitted(true); // Mark the form as submitted
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  // Handle Next button click
  const handleNext = () => {
    navigate('/form5');  // Navigates to /form5
  };

  return (
    <div>
      <h2>Psychological Section</h2>
    
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Question 1 */}
          <div>
            <label>How often do you experience stress or anxiety?</label>
            <div>
              <input type="radio" name="question1" value="0" onChange={handleInputChange} /> Never
              <input type="radio" name="question1" value="1" onChange={handleInputChange} /> Rarely
              <input type="radio" name="question1" value="2" onChange={handleInputChange} /> Sometimes
              <input type="radio" name="question1" value="3" onChange={handleInputChange} /> Often
              <input type="radio" name="question1" value="4" onChange={handleInputChange} /> Very Often
              <input type="radio" name="question1" value="5" onChange={handleInputChange} /> Always
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label>Have you experienced prolonged grief or sadness recently?</label>
            <div>
              <input type="radio" name="question2" value="0" onChange={handleInputChange} /> No
              <input type="radio" name="question2" value="5" onChange={handleInputChange} /> Yes
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <label>How often do you feel anger or frustration?</label>
            <div>
              <input type="radio" name="question3" value="0" onChange={handleInputChange} /> Never
              <input type="radio" name="question3" value="1" onChange={handleInputChange} /> Rarely
              <input type="radio" name="question3" value="2" onChange={handleInputChange} /> Sometimes
              <input type="radio" name="question3" value="3" onChange={handleInputChange} /> Often
              <input type="radio" name="question3" value="4" onChange={handleInputChange} /> Very Often
              <input type="radio" name="question3" value="5" onChange={handleInputChange} /> Always
            </div>
          </div>

          {/* Question 4 */}
          <div>
            <label>Do you often feel mentally exhausted or overwhelmed?</label>
            <div>
              <input type="radio" name="question4" value="0" onChange={handleInputChange} /> Never
              <input type="radio" name="question4" value="1" onChange={handleInputChange} /> Rarely
              <input type="radio" name="question4" value="2" onChange={handleInputChange} /> Sometimes
              <input type="radio" name="question4" value="3" onChange={handleInputChange} /> Often
            </div>
          </div>

          {/* Question 5 */}
          <div>
            <label>Have you experienced guilt or moral distress recently?</label>
            <div>
              <input type="radio" name="question5" value="0" onChange={handleInputChange} /> No
              <input type="radio" name="question5" value="10" onChange={handleInputChange} /> Yes
            </div>
          </div>

          {/* Question 6 */}
          <div>
            <label>Do you feel any pressure or unresolved conflicts in your family or work environment?</label>
            <div>
              <input type="radio" name="question6" value="0" onChange={handleInputChange} /> No
              <input type="radio" name="question6" value="5" onChange={handleInputChange} /> Yes
            </div>
          </div>

          {/* Question 7 */}
          <div>
            <label>Do you ever find yourself speaking disrespectfully or acting rudely towards elders, teachers, or those in authority?</label>
            <div>
              <input type="radio" name="question7" value="0" onChange={handleInputChange} /> Never
              <input type="radio" name="question7" value="3" onChange={handleInputChange} /> Rarely
              <input type="radio" name="question7" value="5" onChange={handleInputChange} /> Sometimes
              <input type="radio" name="question7" value="6" onChange={handleInputChange} /> Often
            </div>
          </div>

          {/* Question 8 */}
          <div>
            <label>Have you ever justified or engaged in unethical actions to achieve personal success or benefits?</label>
            <div>
              <input type="radio" name="question8" value="0" onChange={handleInputChange} /> Never
              <input type="radio" name="question8" value="3" onChange={handleInputChange} /> Rarely
              <input type="radio" name="question8" value="5" onChange={handleInputChange} /> Sometimes
              <input type="radio" name="question8" value="6" onChange={handleInputChange} /> Often
            </div>
          </div>

          {/* Question 9 */}
          <div>
            <label>Have you ever taken something from someone else for your own personal gain?</label>
            <div>
              <input type="radio" name="question9" value="0" onChange={handleInputChange} /> Never
              <input type="radio" name="question9" value="3" onChange={handleInputChange} /> Rarely
              <input type="radio" name="question9" value="5" onChange={handleInputChange} /> Sometimes
              <input type="radio" name="question9" value="6" onChange={handleInputChange} /> Often
            </div>
          </div>

          {/* Question 10 */}
          <div>
            <label>Have you experienced any major stressful life events recently?</label>
            <div>
              <input type="radio" name="question10" value="0" onChange={handleInputChange} /> No
              <input type="radio" name="question10" value="10" onChange={handleInputChange} /> Yes
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-button-container">
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>

        {/* Display the final psychological health score upon form submission */}
        {formSubmitted && (
          <div className="score-container">
            <p>Psychological Health Score: {finalScore}</p>
          </div>
        )}

        {/* Next Button */}
        <div className="next-button-container">
          <button type="button" onClick={handleNext} className="next-button">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Form4;