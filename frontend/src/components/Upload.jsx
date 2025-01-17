import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css'; // Import a CSS file for styling

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(''); // Clear previous errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            // Step 1: Upload the image
            const uploadResponse = await axios.post('http://127.0.0.1:8000/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadedImageId = uploadResponse.data.id; // Assuming the API returns the image ID
            setUploadedImage(uploadResponse.data.image);

            // Step 2: Fetch the prediction
            const predictResponse = await axios.get(`http://127.0.0.1:8000/predict/${uploadedImageId}/`);
            setPrediction(predictResponse.data.prediction);
            setConfidence(predictResponse.data.confidence);
        } catch (error) {
            console.error(error);
            setError('An error occurred while uploading or predicting.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <form onSubmit={handleSubmit} className="upload-form">
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload and Predict'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>

            {uploadedImage && (
                <div className="image-preview">
                    <h3>Uploaded Image:</h3>
                    <img src={`http://127.0.0.1:8000${uploadedImage}`} alt="Uploaded" />
                </div>
            )}

            {prediction && (
                <div className="prediction-result">
                    <h3>Prediction:</h3>
                    <p>{prediction}</p>
                    <h3>Confidence:</h3>
                    <p>{(confidence * 100).toFixed(2)}%</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
