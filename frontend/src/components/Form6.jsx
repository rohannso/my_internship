import React, { useState,useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const VitiligoQuestionnaire = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { returnUrl: '/form6' } });
    }
  }, [navigate]);
  
  const [selectedOptionsFace, setSelectedOptionsFace] = useState([]);
  const [selectedOptionsHandFeet, setSelectedOptionsHandFeet] = useState([]);
  const [selectedOptionsArmsLegs, setSelectedOptionsArmsLegs] = useState([]);
  const [isDepigmentation, setIsDepigmentation] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");

  // Options for select fields
  const spotOnFace = [
    { value: 'at the openings(lips/nostrils/ears)', label: 'At the openings (lips/nostrils/ears)' },
    { value: 'on one side of the face', label: 'On one side of the face' },
    { value: 'on both sides of the face', label: 'On both sides of the face' },
    { value: 'just one spot on the face', label: 'Just one spot on the face' },
  ];

  const spotOnHandFeet = [
    { value: 'at the end of limbs(fingers/toes)', label: 'At the end of limbs (fingers/toes)' },
    { value: 'on both hands or feet', label: 'On both hands or feet' },
    { value: 'on only one hand or feet', label: 'On only one hand or feet' },
  ];

  const spotOnArmsLegs = [
    { value: 'on both arms or legs', label: 'On both arms or legs' },
    { value: 'on only one arm or leg', label: 'On only one arm or leg' },
  ];

  const Depigmentation = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      marginBottom: '1rem',
      borderColor: '#e2e8f0',
      '&:hover': {
        borderColor: '#cbd5e1',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : 'white',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f1f5f9',
      },
    }),
  };

  // Updated handleSubmit function
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8000/api/questionnaire/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          face_spots: selectedOptionsFace.map(option => option.value),
          hand_feet_spots: selectedOptionsHandFeet.map(option => option.value),
          arms_legs_spots: selectedOptionsArmsLegs.map(option => option.value),
          depigmentation: isDepigmentation.map(option => option.value),
          user_id:userId
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowMessage(true);
        sessionStorage.setItem('questionnaireSubmitted', 'true');
        
        // Wait for message to be visible
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Navigate to Form7 and force a refresh
        navigate('/form7', { replace: true });
        window.location.reload();
      } else {
        setShowMessage(true);
        console.error('Submission failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setShowMessage(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vitiligo Lesion Questionnaire
          </h1>
          <p className="text-gray-600">
            Please select all applicable options for each section
          </p>
        </div>

        {showMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">Submitted successfully!</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="inputSection">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Location of spot on face?
            </h2>
            <Select
              options={spotOnFace}
              isMulti
              value={selectedOptionsFace}
              onChange={setSelectedOptionsFace}
              placeholder="Choose options..."
              styles={customStyles}
              className="basic-multi-select"
              isDisabled={isSubmitting}
            />
          </div>

          <div className="inputSection">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Location of spot on hands or feet?
            </h2>
            <Select
              options={spotOnHandFeet}
              isMulti
              value={selectedOptionsHandFeet}
              onChange={setSelectedOptionsHandFeet}
              placeholder="Choose options..."
              styles={customStyles}
              className="basic-multi-select"
              isDisabled={isSubmitting}
            />
          </div>

          <div className="inputSection">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Location of spot on arms or legs?
            </h2>
            <Select
              options={spotOnArmsLegs}
              isMulti
              value={selectedOptionsArmsLegs}
              onChange={setSelectedOptionsArmsLegs}
              placeholder="Choose options..."
              styles={customStyles}
              className="basic-multi-select"
              isDisabled={isSubmitting}
            />
          </div>

          <div className="inputSection">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Is there any depigmentation?
            </h2>
            <Select
              options={Depigmentation}
              isMulti
              value={isDepigmentation}
              onChange={setIsDepigmentation}
              placeholder="Choose options..."
              styles={customStyles}
              className="basic-multi-select"
              isDisabled={isSubmitting}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VitiligoQuestionnaire;