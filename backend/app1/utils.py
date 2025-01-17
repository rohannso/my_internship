import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import load_model
from PIL import Image
from django.conf import settings
import cv2
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Define the path to your model
MODEL_PATH = os.path.join(settings.BASE_DIR, 'app1', 'vitiligo-resnet-finetuned-01.h5')

# Load the model once at runtime
def load_model_once():
    """Load and return the ML model."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    return load_model(MODEL_PATH)


def apply_wood_lamp_effect(image):
    """Apply Wood's lamp effect to enhance the visualization."""
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Enhance contrast using CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast_enhanced = clahe.apply(gray_image)

    # Apply a blue color map to mimic the Wood's lamp appearance
    wood_lamp_effect = cv2.applyColorMap(contrast_enhanced, cv2.COLORMAP_OCEAN)

    # Blend the original image with the Wood's lamp effect
    blended = cv2.addWeighted(image, 0.5, wood_lamp_effect, 0.5, 0)

    return blended, contrast_enhanced
def create_heatmap(gray_image):
    """Create a heatmap highlighting potential vitiligo patches."""
    # Threshold to identify potential patches
    _, thresholded = cv2.threshold(gray_image, 180, 255, cv2.THRESH_BINARY)

    # Apply a heatmap color map
    heatmap = cv2.applyColorMap(thresholded, cv2.COLORMAP_JET)

    return heatmap

# Convert image to grayscale
def convert_to_grayscale(image):
    """Convert an image to grayscale."""
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Preprocess the image
def preprocess_image(image_path, target_size=(224, 224)):
    """Preprocess the image for the ML model."""
    image = Image.open(image_path).convert("RGB")  # Ensure RGB format
    image = image.resize(target_size)             # Resize to target size
    image_array = np.array(image) / 255.0         # Normalize pixel values
    return np.expand_dims(image_array, axis=0)    # Add batch dimension

# Predict the class of the image
def predict_image(image_path):
    """Predict the label of the image using the ML model."""
    # Load the model
    model = load_model_once()

    # Preprocess the image
    processed_image = preprocess_image(image_path)

    # Make the prediction
    prediction = model.predict(processed_image)[0][0]
    label = "Vitiligo Detected" if prediction >= 0.5 else "No Vitiligo Detected"
    confidence = round(prediction, 2)
    return label, confidence


# Load your trained model
from joblib import load
path_svm = r'C:\Users\r\Vitiligo_new\Vitiligo\backend\b\app1\best.pkl'
if os.path.exists(path_svm):
    svc_model = load(path_svm)
else:
    print(f"File not found: {path_svm}")




def calculate_combined_score(diet_score, environmental_score, lifestyle_score, psychological_score, family_score):
    """
    Calculate the combined score as the average of the individual scores.
    Modify the formula if needed.
    """
    return (diet_score + environmental_score + lifestyle_score + psychological_score + family_score) 

def predict_vitiligo_risk(diet_score, environmental_score, lifestyle_score, psychological_score, family_score, combined_score):
    """
    Use the trained model to predict the risk of vitiligo.
    """
    scores_input = np.array([[diet_score, environmental_score, lifestyle_score, psychological_score, family_score, combined_score]])
    prediction = svc_model.predict(scores_input)
    return prediction[0]


import os
import matplotlib.pyplot as plt
from django.conf import settings

def create_pie_chart(family_score, diet_score, lifestyle_score, psychological_score, environmental_score):
    # Create a dictionary of scores
    scores = {
        'Family Score': family_score,
        'Diet Score': diet_score,
        'Lifestyle Score': lifestyle_score,
        'Psychological Score': psychological_score,
        'Environmental Score': environmental_score,
    }

    # Create a pie chart
    labels = scores.keys()
    sizes = scores.values()
    colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0']

    plt.figure(figsize=(8, 8))
    plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)
    plt.axis('equal')  # Equal aspect ratio ensures that pie chart is a circle.

    # Ensure the directory exists
    chart_path = os.path.join(settings.MEDIA_ROOT, 'charts')
    os.makedirs(chart_path, exist_ok=True)

    # Save the pie chart as an image
    file_path = os.path.join(chart_path, "pie_chart.png")
    plt.savefig(file_path)
    plt.close()  # Close the figure

    return file_path
