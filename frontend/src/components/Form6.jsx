import React from 'react'
import { useNavigate } from 'react-router-dom';

const Form6 = () => {

    const navigate = useNavigate(); 
    const handleNext = () => {
        navigate('/form7');  // Navigates to /form4
      };

  return (
    <div>
      Vitiligo Lesion Questionnaire
      <button type="button" onClick={handleNext} className="next-button">
          Next
        </button>
    </div>
  )
}

export default Form6
