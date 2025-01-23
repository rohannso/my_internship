import React, { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Form.css';

const Form = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { returnUrl: '/form' } });
    }
  }, [navigate]);
  const handleNext = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { returnUrl: '/form2' } });
      return;
    }
    // Navigate to the next form (Form2)
    navigate("/form2");
  };

  const [responses, setResponses] = useState({
    family_history_skin_disorders: 0,
    family_history_depigmentation: 0,
    personal_history_autoimmune: 0,
    sour_foods: [],
    salty_foods: [],
    processed_foods: [],
    incompatible_combinations: [],
    food_habits: [],
    oily_foods: [],
    meals_before_digestion: "",
  });

  const [familyScore, setFamilyScore] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [dietScore, setDietScore] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const userId = localStorage.getItem("userId");

  const foodCategories = {
    "Sour Foods": [
      "Fermented products", "Pickles", "Bhelpuri", "Sour fruit juices",
      "Tomato sauce", "Excess intake of preserved foods", "Curd",
      "Buttermilk", "Lemon juice", "Vinegar", "Alcohol", "Cold drinks"
    ],
    "Salty Foods": [
      "Salt predominant foods", "Papad", "Chips", "Namkeen", "Salt while eating"
    ],
    "Processed or Fried Foods": [
      "Pizza", "Cheese mixed foods", "Bakery products", "Kidney beans", 
      "Paneer", "Dosa", "Idli", "Vada", "Beef", "Pork", 
      "Food prepared from flour", "Regular intake of meat products", 
      "Intake of milk shakes", "Kheer"
    ],
    "Incompatible Food Combinations": [
      "Sprouted vegetables/grains with meat", "Milk with meat", 
      "Jaggery with meat", "Milk or honey with leafy vegetables", 
      "Curd with chicken", "Honey + hot water", 
      "Seafood with milk", "Seafood with sweet", 
      "Banana or fruit with milk", "Fruit salad", 
      "Smoothies", "Milk with sour food", 
      "Alcohol with or after milk", "Milk + rice + salt", 
      "Curd + milk + rice"
    ],
    "Food Habits": [
      "Cold + hot food together", "Cold food soon after intake of hot food or vice versa", 
      "Cold water with hot lunch/dinner", "Dessert along with hot food", 
      "Using cold milk with hot samosa", "Spicy and pungent foods with more of red chili, pepper"
    ],
    "Oily Foods": [
      "Excessively oily foods", "Biriyani", "Meat soups", 
      "Sweets made of excess ghee, milk", "Food prepared with cheese & ghee"
    ]
  };

  const handleChange = (event, category) => {
    const { value } = event.target;
    setResponses({
      ...responses,
      [category]: value,
    });
  };

  const handleCheckboxChange = (event, category) => {
    const { value, checked } = event.target;
    const updatedResponses = { ...responses };

    if (checked) {
      updatedResponses[category].push(value);
    } else {
      updatedResponses[category] = updatedResponses[category].filter(item => item !== value);
    }

    setResponses(updatedResponses);
  };

  const handleSubmitFamilyHistory = async (event) => {
    event.preventDefault();
    const totalScore = Object.values(responses).slice(0, 3).reduce((acc, val) => acc + parseInt(val), 0);

    const data = {
      ...responses,
      family_score: totalScore,
      userId,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/submit_family_history/', data);
      

      if (response.status === 200) {
        setFamilyScore(response.data.family_score);
        setPrediction(response.data.prediction);
        setErrorMessage('');
        alert("Family History data submitted successfully!");
      }
    } catch (error) {
      setErrorMessage('There was an error submitting Family History data');
    }
  };

  const handleSubmitDiet = async (event) => {
  event.preventDefault();

  // Prepare data to match the expected backend format
  const formattedResponses = {
    sour_foods: responses.sour_foods.map((food) => ({ food, days: "1-3" })), // Add `days` dynamically if necessary
    salty_foods: responses.salty_foods.map((food) => ({ food, days: "1-3" })),
    processed_foods: responses.processed_foods.map((food) => ({ food, days: "1-3" })),
    incompatible_combinations: responses.incompatible_combinations.map((food) => ({ food, days: "1-3" })),
    food_habits: responses.food_habits.map((habit) => ({ habit, days: "1-3" })),
    oily_foods: responses.oily_foods.map((food) => ({ food, days: "1-3" })),
    meals_before_digestion: responses.meals_before_digestion,
    userId, // Directly add as string
  };

  try {
    const response = await axios.post('http://localhost:8000/api/submit_diet_history/', formattedResponses);

    if (response.status === 200) {
      setDietScore(response.data.diet_score);
      setErrorMessage('');
      alert("Diet data submitted successfully!");
    }
  } catch (error) {
    setErrorMessage('There was an error submitting your diet data');
  }
};


  return (
    <div className="form-container">
      <h2>Vitiligo Risk Prediction</h2>

      {/* Family History Form */}
      <form onSubmit={handleSubmitFamilyHistory}>
        <div className="form-section">
          <label>
            Do you have a family history of vitiligo or other skin disorders?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="family_history_skin_disorders"
                value="10"
                onChange={(e) => handleChange(e, "family_history_skin_disorders")}
              />
              Yes (10)
            </label>
            <label>
              <input
                type="radio"
                name="family_history_skin_disorders"
                value="0"
                onChange={(e) => handleChange(e, "family_history_skin_disorders")}
              />
              No (0)
            </label>
          </div>
        </div>

        <div className="form-section">
          <label>
            Has anyone in your family experienced depigmentation (loss of skin color)?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="family_history_depigmentation"
                value="10"
                onChange={(e) => handleChange(e, "family_history_depigmentation")}
              />
              Yes (10)
            </label>
            <label>
              <input
                type="radio"
                name="family_history_depigmentation"
                value="0"
                onChange={(e) => handleChange(e, "family_history_depigmentation")}
              />
              No (0)
            </label>
          </div>
        </div>

        <div className="form-section">
          <label>
            Do you have a personal history of autoimmune diseases (e.g., thyroid disorders, diabetes)?
          </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="personal_history_autoimmune"
                value="10"
                onChange={(e) => handleChange(e, "personal_history_autoimmune")}
              />
              Yes (10)
            </label>
            <label>
              <input
                type="radio"
                name="personal_history_autoimmune"
                value="0"
                onChange={(e) => handleChange(e, "personal_history_autoimmune")}
              />
              No (0)
            </label>
          </div>
        </div>

        <button type="submit">Submit Family History</button>
      </form>

      {/* Family Score and Prediction */}
      {familyScore && (
        <div className="result">
          <h3>Your Family Risk Score: {familyScore}</h3>
          {prediction && <h4>Prediction: {prediction}</h4>}
        </div>
      )}

<button onClick={handleNext}>Next</button>

      {/* Error Messages */}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
};

export default Form;

  