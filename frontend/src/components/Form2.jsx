import React, { useState,useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const DietAssessment = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login', { state: { returnUrl: '/form2' } });
    }
  }, [navigate]);
   const [selectedOptions, setSelectedOptions] = useState({
    sourFoods: [],
    saltyFoods: [],
    processedOrFriedFoods: [],
    incompatibleFoodCombinations: [],
    foodHabits: [],
    oilyFoods: [],
  });

  const [mealsBeforeDigestion, setMealsBeforeDigestion] = useState(false);
  const [extraInputs, setExtraInputs] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });
  const [isLoading, setIsLoading] = useState(false);
  const [daysCount, setDaysCount] = useState(null);
  const userId = localStorage.getItem("userId");

  const categories = {
    sourFoods: [
      { value: 'Fermented products', label: 'Fermented products' },
      { value: 'Pickles', label: 'Pickles' },
      { value: 'Bhelpuri', label: 'Bhelpuri' },
      { value: 'Sour fruit juices', label: 'Sour fruit juices' },
      { value: 'Tomato sauce', label: 'Tomato sauce' },
      { value: 'Excess intake of preserved foods', label: 'Excess intake of preserved foods' },
      { value: 'Curd', label: 'Curd' },
      { value: 'Buttermilk', label: 'Buttermilk' },
      { value: 'Lemon juice', label: 'Lemon juice' },
      { value: 'Vinegar', label: 'Vinegar' },
      { value: 'Alcohol', label: 'Alcohol' },
      { value: 'Cold drinks', label: 'Cold drinks' },
    ],
    saltyFoods: [
      { value: 'Salt predominant foods', label: 'Salt predominant foods' },
      { value: 'Papad', label: 'Papad' },
      { value: 'Chips', label: 'Chips' },
      { value: 'Namkeen', label: 'Namkeen' },
      { value: 'Salt while eating', label: 'Salt while eating' },
    ],
    processedOrFriedFoods: [
      { value: 'Pizza', label: 'Pizza' },
      { value: 'Cheese mixed foods', label: 'Cheese mixed foods' },
      { value: 'Bakery products', label: 'Bakery products' },
      { value: 'Kidney beans', label: 'Kidney beans' },
      { value: 'Paneer', label: 'Paneer' },
      { value: 'Dosa', label: 'Dosa' },
      { value: 'Idli', label: 'Idli' },
      { value: 'Vada', label: 'Vada' },
      { value: 'Beef', label: 'Beef' },
      { value: 'Pork', label: 'Pork' },
      { value: 'Food prepared from flour', label: 'Food prepared from flour' },
      { value: 'Regular intake of meat products', label: 'Regular intake of meat products' },
      { value: 'Intake of milk shakes', label: 'Intake of milk shakes' },
      { value: 'Kheer', label: 'Kheer' },
    ],
    incompatibleFoodCombinations: [
      { value: 'Sprouted vegetables/grains with meat', label: 'Sprouted vegetables/grains with meat' },
      { value: 'Milk with meat', label: 'Milk with meat' },
      { value: 'Jaggery with meat', label: 'Jaggery with meat' },
      { value: 'Milk or honey with leafy vegetables', label: 'Milk or honey with leafy vegetables' },
      { value: 'Curd with chicken', label: 'Curd with chicken' },
      { value: 'Honey + hot water', label: 'Honey + hot water' },
      { value: 'Seafood with milk', label: 'Seafood with milk' },
      { value: 'Seafood with sweet', label: 'Seafood with sweet' },
      { value: 'Banana or fruit with milk', label: 'Banana or fruit with milk' },
      { value: 'Fruit salad', label: 'Fruit salad' },
      { value: 'Smoothies', label: 'Smoothies' },
      { value: 'Milk with sour food', label: 'Milk with sour food' },
      { value: 'Alcohol with or after milk', label: 'Alcohol with or after milk' },
      { value: 'Milk + rice + salt', label: 'Milk + rice + salt' },
      { value: 'Curd + milk + rice', label: 'Curd + milk + rice' },
    ],
    foodHabits: [
      { value: 'Cold + hot food together', label: 'Cold + hot food together' },
      { value: 'Cold food soon after intake of hot food or vice versa', label: 'Cold food soon after intake of hot food or vice versa' },
      { value: 'Cold water with hot lunch/dinner', label: 'Cold water with hot lunch/dinner' },
      { value: 'Dessert along with hot food', label: 'Dessert along with hot food' },
      { value: 'Using cold milk with hot samosa', label: 'Using cold milk with hot samosa' },
      { value: 'Spicy and pungent foods with more of red chili, pepper', label: 'Spicy and pungent foods with more of red chili, pepper' },
    ],
    oilyFoods: [
      { value: 'Excessively oily foods', label: 'Excessively oily foods' },
      { value: 'Biriyani', label: 'Biriyani' },
      { value: 'Meat soups', label: 'Meat soups' },
      { value: 'Sweets made of excess ghee, milk', label: 'Sweets made of excess ghee, milk' },
      { value: 'Food prepared with cheese & ghee', label: 'Food prepared with cheese & ghee' },
    ],
  };

  const extraInputOptions = [
    { value: '1-3', label: '1-3 Days' },
    { value: '3-5', label: '3-5 Days' },
    { value: '5-7', label: '5-7 Days' },
  ];

  const handleCategoryChange = (category, selected) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: selected || [],
    }));

    const newExtraInputs = { ...extraInputs };
    
    selected.forEach((item) => {
      if (!newExtraInputs[item.value]) {
        newExtraInputs[item.value] = null;
      }
    });

    Object.keys(newExtraInputs).forEach((key) => {
      if (!selected.find((item) => item.value === key)) {
        delete newExtraInputs[key];
      }
    });

    setExtraInputs(newExtraInputs);
  };

  const handleExtraInputChange = (key, value) => {
    setExtraInputs((prev) => ({ ...prev, [key]: value }));
  };

  const calculateTotalDays = () => {
    let total = 0;
    Object.values(extraInputs).forEach(value => {
      if (value?.value) {
        const [min, max] = value.value.split('-').map(Number);
        total += (min + max) / 2;
      }
    });
    return Math.round(total);
  };

  const formatDataForApi = () => {
    const formatCategory = (items) => 
      items.map(item => ({
        name: item.value,
        days: extraInputs[item.value]?.value || '1-3' // Changed from days_consumed to days
      }));

    return {
      sour_foods: formatCategory(selectedOptions.sourFoods),
      salty_foods: formatCategory(selectedOptions.saltyFoods),
      processed_foods: formatCategory(selectedOptions.processedOrFriedFoods),
      incompatible_combinations: formatCategory(selectedOptions.incompatibleFoodCombinations),
      food_habits: formatCategory(selectedOptions.foodHabits),
      oily_foods: formatCategory(selectedOptions.oilyFoods),
      meals_before_digestion: mealsBeforeDigestion ? "Yes" : "No" ,// Changed from boolean to "Yes"/"No"
      user_id:userId
    };
  };
  

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formattedData = formatDataForApi();
      const totalDays = calculateTotalDays();
      setDaysCount(totalDays);
      
      console.log('Sending data:', JSON.stringify(formattedData, null, 2)); // Debug log
      
      const response = await fetch('http://localhost:8000/api/diet-assessment/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      console.log('📥 Received response:', data); // ✅ Log API response


      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit assessment');
      }

      setSubmitStatus({
        message: `Assessment created successfully! Diet Score: ${data.diet_score}`,
        error: false
      });
      navigate('/form3');
    } catch (error) {
      setSubmitStatus({
        message: error.message,
        error: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Diet Assessment Form</h1>
      
      {Object.entries(categories).map(([categoryKey, options]) => (
        <div key={categoryKey} className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            {categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </h2>
          <Select
            options={options}
            isMulti
            value={selectedOptions[categoryKey]}
            onChange={(selected) => handleCategoryChange(categoryKey, selected)}
            placeholder={`Select ${categoryKey.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
            className="mb-4"
          />
          {selectedOptions[categoryKey]?.map((item) => (
            <div key={item.value} className="ml-4 mb-3">
              <label className="block text-sm font-medium mb-1">
                Days consumed for {item.label}
              </label>
              <Select
                options={extraInputOptions}
                value={extraInputs[item.value]}
                onChange={(selected) => handleExtraInputChange(item.value, selected)}
                placeholder="Select days..."
                className="w-48"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Digestion Assessment</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Have you consumed meals before digestion?</span>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="digestion"
              value="yes"
              checked={mealsBeforeDigestion === true}
              onChange={(e) => setMealsBeforeDigestion(e.target.value === 'yes')}
              className="mr-2"
            />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="digestion"
              value="no"
              checked={mealsBeforeDigestion === false}
              onChange={(e) => setMealsBeforeDigestion(e.target.value === 'yes')}
              className="mr-2"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Submitting...' : 'Submit Assessment'}
      </button>

      {submitStatus.message && (
        <div className={`mt-4 p-4 rounded ${submitStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {submitStatus.message}
        </div>
      )}
    </div>




);
};

export default DietAssessment;