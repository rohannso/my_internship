import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const RiskPredictionResults = () => {
  // Existing states...
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePrediction, setImagePrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate(); // Define navigate here
  
  // New states for image processing results
  const [woodLampEffect, setWoodLampEffect] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [grayscaleImage, setGrayscaleImage] = useState(null);
  const [activeTab, setActiveTab] = useState('original');

  // Existing useEffect and fetchPredictionData remain the same...
  useEffect(() => {
    fetchPredictionData();
  }, []);
  

  const fetchPredictionData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/predict-risk/');
      if (!response.ok) {
        throw new Error('Failed to fetch prediction data');
      }
      const data = await response.json();
      setPredictionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoToUserInputForm = () => {
    navigate('/user-input-form'); // Navigates to the UserInputForm page
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError('');
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadLoading(true);
      const uploadResponse = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      setUploadedImage(uploadData.image);

      const predictResponse = await fetch(`http://127.0.0.1:8000/predict/${uploadData.id}/`);
      if (!predictResponse.ok) {
        throw new Error('Prediction failed');
      }

      const predictData = await predictResponse.json();
      setImagePrediction(predictData.prediction);
      setConfidence(predictData.confidence);
      setWoodLampEffect(`data:image/jpeg;base64,${predictData.wood_lamp_effect}`);
      setHeatmap(`data:image/jpeg;base64,${predictData.heatmap}`);
      setGrayscaleImage(`data:image/jpeg;base64,${predictData.grayscale_image}`);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // New component for image analysis tabs
  const ImageAnalysisTabs = () => {
    const tabStyle = (isActive) => ({
      padding: '10px 20px',
      cursor: 'pointer',
      backgroundColor: isActive ? '#007bff' : '#f8f9fa',
      color: isActive ? 'white' : 'black',
      border: 'none',
      borderRadius: '4px',
      margin: '0 5px',
      transition: 'all 0.3s ease'
    });

    return (
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button
          style={tabStyle(activeTab === 'original')}
          onClick={() => setActiveTab('original')}
        >
          Original
        </button>
        <button
          style={tabStyle(activeTab === 'woodlamp')}
          onClick={() => setActiveTab('woodlamp')}
        >
          Wood's Lamp
        </button>
        <button
          style={tabStyle(activeTab === 'heatmap')}
          onClick={() => setActiveTab('heatmap')}
        >
          Heatmap
        </button>
        <button
          style={tabStyle(activeTab === 'grayscale')}
          onClick={() => setActiveTab('grayscale')}
        >
          Grayscale
        </button>
      </div>
    );
  };

  // New component for displaying the current image view
  const ImageView = () => {
    let currentImage = null;
    let title = '';

    switch (activeTab) {
      case 'original':
        currentImage = uploadedImage ? `http://127.0.0.1:8000${uploadedImage}` : null;
        title = 'Original Image';
        break;
      case 'woodlamp':
        currentImage = woodLampEffect;
        title = "Wood's Lamp Effect";
        break;
      case 'heatmap':
        currentImage = heatmap;
        title = 'Heatmap Analysis';
        break;
      case 'grayscale':
        currentImage = grayscaleImage;
        title = 'Grayscale Analysis';
        break;
      default:
        currentImage = uploadedImage ? `http://127.0.0.1:8000${uploadedImage}` : null;
    }

    return currentImage ? (
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '15px' }}>{title}</h3>
        <img
          src={currentImage}
          alt={title}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      </div>
    ) : null;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Risk Prediction Section - Keeping existing code... */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Vitiligo Risk Assessment Results
        </h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading prediction results...
          </div>
        )}

        {error && (
          <div style={{ 
            color: 'red', 
            padding: '10px', 
            backgroundColor: '#ffe6e6', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            Error loading prediction results: {error}
          </div>
        )}

        {!loading && !error && predictionData && (
          // ... Existing risk prediction results JSX
          <div>
            {/* Individual Scores */}
            <div style={{ 
              border: '1px solid #ccc',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '15px' }}>Individual Assessment Scores</h2>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  ['Diet Score', predictionData.diet_score],
                  ['Environmental Score', predictionData.environmental_score],
                  ['Lifestyle Score', predictionData.lifestyle_score],
                  ['Psychological Score', predictionData.psychological_score],
                  ['Family History Score', predictionData.family_score]
                ].map(([label, value]) => (
                  <div key={label} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '4px'
                  }}>
                    <span>{label}:</span>
                    <span style={{ fontWeight: 'bold' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Assessment */}
            <div style={{ 
              border: '1px solid #ccc',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '15px' }}>Overall Risk Assessment</h2>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Combined Score</h3>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {predictionData.combined_score}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Risk Prediction</h3>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {predictionData.risk_prediction}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Image Upload Section */}
      <div style={{ marginTop: '40px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Vitiligo Image Detection
        </h1>

        <div style={{ 
          border: '1px solid #ccc', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px' 
        }}>
          <h2 style={{ marginBottom: '15px' }}>Upload Image</h2>
          
          <form onSubmit={handleImageUpload}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'block', width: '100%', marginBottom: '10px' }}
              />
            </div>

            <button 
              type="submit"
              disabled={uploadLoading}
              style={{
                backgroundColor: uploadLoading ? '#ccc' : '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: uploadLoading ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {uploadLoading ? 'Processing...' : 'Upload and Analyze'}
            </button>
          </form>

          {uploadError && (
            <div style={{ 
              color: 'red', 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#ffe6e6', 
              borderRadius: '4px' 
            }}>
              {uploadError}
            </div>
          )}
        </div>

        {/* Enhanced Image Analysis Results */}
        {uploadedImage && (
          <div style={{ 
            border: '1px solid #ccc', 
            padding: '20px', 
            borderRadius: '8px' 
          }}>
            {/* Image Analysis Tabs */}
            <ImageAnalysisTabs />

            {/* Image View */}
            <div style={{ marginBottom: '20px' }}>
              <ImageView />
            </div>

            {/* Detection Results */}
            {imagePrediction && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>Detection Results</h3>
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '4px' 
                }}>
                  <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                    {imagePrediction}
                  </p>
                  <p style={{ color: '#666' }}>
                    Confidence: {(confidence * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          <button
            onClick={() => {
              // Navigate to the User Input Form
              navigate('/user-input-form', { state: { imagePrediction, confidence, woodLampEffect, heatmap, grayscaleImage } });
            }}
            style={{
              backgroundColor: '#007bff',
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
            Generate Report
          </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskPredictionResults;