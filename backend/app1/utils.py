import os
import numpy as np

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
    return label, confidence,prediction


# Load your trained model
from joblib import load
path_svm = os.path.join(settings.BASE_DIR, 'app1','best.pkl')
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

def save_image(image, filename):
    # Ensure the output directory exists
    output_dir = "output_images"  # Replace with your desired output path
    os.makedirs(output_dir, exist_ok=True)

    # Construct the full path
    filepath = os.path.join(output_dir, filename)

    # Save the image using cv2
    if len(image.shape) == 2:  # If it's a grayscale image
        cv2.imwrite(filepath, image)
    else:  # If it's a color image
        cv2.imwrite(filepath, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))

    return filepath  # Return the path for reference

def determine_vitiligo_type(responses):
    vitiligo_types = set()

    # Logic for location of spot on face
    if 'at the openings(lips/nostrils/ears)' in responses['face']:
        vitiligo_types.add('Acrofacial vitiligo (due to spots on the face openings).')
    if 'on one side of the face' in responses['face']:
        vitiligo_types.add('Segmental vitiligo (due to spots on one side of the face).')
    if 'on both sides of the face' in responses['face']:
        vitiligo_types.add('Non-segmental vitiligo (due to spots on both sides of the face).')
    if 'just one spot on face' in responses['face']:
        vitiligo_types.add('Focal vitiligo (due to a single spot on the face).')

    # Logic for location of spot on hands and feet
    if 'at the ends of limbs(fingers / toes)' in responses['hands_feet']:
        vitiligo_types.add('Acrofacial vitiligo (due to spots on the fingers).')
    if 'on both hands or feet' in responses['hands_feet']:
        vitiligo_types.add('Non-segmental vitiligo (due to spots on both hands or feet).')
    if 'on only one hand or feet' in responses['hands_feet']:
        vitiligo_types.add('Segmental vitiligo (due to spots on only one hand or foot).')

    # Logic for location of spot on arms and legs
    if 'on both arms or legs' in responses['arms_legs']:
        vitiligo_types.add('Non-segmental vitiligo (due to spots on both arms or legs).')
    if 'on only one arm or leg' in responses['arms_legs']:
        vitiligo_types.add('Segmental vitiligo (due to spots on only one arm or leg).')

    # Logic for depigmentation over 80% of the body
    if 'yes' in responses['whole_body']:
        vitiligo_types.add('Universal vitiligo (due to depigmentation affecting over 80% of the body).')

    # Return the vitiligo type(s)
    if vitiligo_types:
        return ', '.join(vitiligo_types)
    else:
        return 'Unknown type'

def generate_insights_and_conclusion(white_patches, patch_shape, expanding_patches, patch_duration, sensations, color_change, new_patches, visibility_in_sunlight):
    insights = []
    
    # Insights for white patches
    if white_patches == 'Yes':
        insights.append("1) The patient has white patches, which can suggest depigmentation-related conditions like vitiligo.")
        
        # Shape of patches
        if patch_shape == 'Irregular':
            insights.append(" 2) Irregular shapes can indicate an active, progressive phase of vitiligo, compared to round/oval shapes, which might signify more stable patches.")
        elif patch_shape in ['Round', 'Oval']:
            insights.append(" 2) Round/oval shapes may indicate more stable vitiligo patches.")
        else:
            insights.append(" 2) Uncertain shape may require further observation.")

        # Expansion over time
        if expanding_patches == 'Yes, they are growing':
            insights.append(" 3) The condition is still progressing, and the patches are likely spreading, which could require more aggressive treatment.")
        elif expanding_patches == 'No, they have remained the same size':
            insights.append(" 3) The vitiligo appears stable without active spreading.")
        else:
            insights.append(" 3) Uncertainty about patch expansion may require monitoring.")
        
        # Duration of condition
        if patch_duration in ['6-12 months', 'More than 1 year']:
            insights.append("4) The patient has been experiencing symptoms for a significant period, suggesting chronic vitiligo.")
        elif patch_duration in ['Less than 3 months', '3-6 months']:
            insights.append("4) A relatively recent onset, which may indicate early-stage vitiligo.")

        # Sensations
        if sensations == 'No, no sensations':
            insights.append("5) Lack of sensations like itching or pain can rule out inflammatory skin conditions, as vitiligo typically doesn’t involve sensory symptoms.")
        else:
            insights.append(f"5) The presence of {sensations} might require additional investigation for other skin conditions.")

        # Color change over time
        if color_change == 'Yes, they have lightened over time':
            insights.append("6) Depigmentation has progressed from partial loss of skin color to complete depigmentation, a hallmark of vitiligo progression.")
        else:
            insights.append("6) The patches have remained stable in color.")
        
        # New patches
        if new_patches == 'Yes, within the last 3 months':
            insights.append("7) New patches indicate active vitiligo, suggesting the disease is still spreading.")
        else:
            insights.append("7) No new patches suggest stability.")

        # Visibility in sunlight
        if visibility_in_sunlight == 'Yes, they are more noticeable':
            insights.append("8) The contrast between normal skin and depigmented patches increases when the skin tans, often seen in vitiligo.")
        else:
            insights.append("8) No change in visibility suggests the patches may blend more with the skin tone.")
    
    else:
        insights.append("Insight: No white patches indicate vitiligo may not be present.")

    # Conclusion based on the responses
    conclusion = "From these responses, we gather that the patient is "
    
    if expanding_patches == 'Yes, they are growing' or new_patches == 'Yes, within the last 3 months':
        conclusion += "likely dealing with progressive vitiligo. The condition is still spreading, as "
        if expanding_patches == 'Yes, they are growing':
            conclusion += "existing patches have grown larger, "
        if new_patches == 'Yes, within the last 3 months':
            conclusion += "new patches have appeared recently, "
        conclusion = conclusion.rstrip(", ") + ". "
    else:
        conclusion += "likely dealing with stable vitiligo, as there has been no significant spread of the patches. "

    if sensations == 'No, no sensations':
        conclusion += "The lack of pain or itching helps distinguish it from other skin conditions like eczema or psoriasis, which often involve these symptoms. "

    if visibility_in_sunlight == 'Yes, they are more noticeable':
        conclusion += "The increased visibility of the patches in sunlight supports the diagnosis of vitiligo, as tanning makes the depigmentation more apparent. "

    conclusion += "Overall, the responses suggest that "
    if expanding_patches == 'Yes, they are growing' or new_patches == 'Yes, within the last 3 months':
        conclusion += "the condition is still active and progressing."
    else:
        conclusion += "the condition is stable and not actively spreading."

    return insights, conclusion


from fpdf import FPDF

def generate_vitiligo_report(patient_name, age, gender, date, diet_score, environmental_score, lifestyle_score, 
                           psychological_score, family_score, combined_score, prediction, insights, conclusion,
                           image, wood_lamp_image, grayscale_image, heatmap_image, prediction_label):
    reports_dir = os.path.join(os.getcwd(), 'reports')
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
    
    # Generate timestamp for unique filename
    #timestamp = date.now().strftime('%Y%m%d_%H%M%S')
    report_filename = f"{patient_name}_vitiligo_report.pdf"
    report_path = os.path.join(reports_dir, report_filename)
    pdf = FPDF()
    pdf.add_page()
    
    # Use built-in fonts instead of DejaVuSans
    pdf.set_font("Arial", size=14)

    # Header
    pdf.set_font("Arial", 'B', 16)
    pdf.set_text_color(0, 102, 204)  # Blue color
    pdf.cell(200, 10, "Vitiligo Assessment Report", ln=True, align='C')

    # Reset text color to black for patient info
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", '', 12)
    pdf.cell(200, 10, f"Patient Name: {patient_name}", ln=True)
    pdf.cell(200, 10, f"Age: {age}", ln=True)
    pdf.cell(200, 10, f"Gender: {gender}", ln=True)
    pdf.cell(200, 10, f"Date: {date}", ln=True)

    pdf.ln(20)  # Space before diagnostics

    # Diagnostics Section
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(0, 102, 204)  # Blue color
    pdf.cell(200, 10, "Diagnostic Report", ln=True)

    # Family History Section
    pdf.set_font("Arial", '', 12)
    pdf.set_text_color(0, 0, 0)  # Black color
    if family_score >= 10:
        pdf.cell(200, 10, "1)Family History: High Risk", ln=True)
    elif 5 <= family_score < 10:
        pdf.cell(200, 10, "1)Family History: Moderate Risk", ln=True)
    else:
        pdf.cell(200, 10, "1)Family History: Low Risk", ln=True)

    pdf.ln(5)

    # Dietary Section
    pdf.set_text_color(0, 0, 0)  # Black color
    if 0 <= diet_score < 28:
        pdf.cell(200, 10, "2)Dietary Section: Low Risk", ln=True)
        pdf.cell(200, 10, "Description: Minimal dietary exposure related to vitiligo risk.", ln=True)
    elif 29 <= diet_score < 56:
        pdf.cell(200, 10, "2)Dietary Section: Moderate Risk", ln=True)
        pdf.cell(200, 10, "Description: Moderate dietary exposure; review of eating habits recommended.", ln=True)
    elif 57 <= diet_score < 84:
        pdf.cell(200, 10, "2)Dietary Section: High Risk", ln=True)
        pdf.cell(200, 10, "Description: Significant dietary influence linked to vitiligo; dietary changes advised.", ln=True)
    else:
        pdf.cell(200, 10, "Dietary Section: Very High Risk", ln=True)
        pdf.cell(200, 10, "Description: Strong dietary factors likely causing or exacerbating vitiligo; immediate action required.", ln=True)

    pdf.ln(5)

    # Lifestyle Section
    if 0 <= lifestyle_score < 15:
        pdf.cell(200, 10, "3)Lifestyle Section: Low Risk", ln=True)
        pdf.cell(200, 10, "Description: Minimal lifestyle-related issues.", ln=True)
    elif 16 <= lifestyle_score < 30:
        pdf.cell(200, 10, "3)Lifestyle Section: Moderate Risk", ln=True)
        pdf.cell(200, 10, "Description: Moderate lifestyle-related issues; attention recommended", ln=True)
    else:
        pdf.cell(200, 10, "3)Lifestyle Section: High Risk", ln=True)
        pdf.cell(200, 10, "Description: High levels of lifestyle-related issues; action advised.", ln=True)

    pdf.ln(5)

    # Psychological Section
    if 0 <= psychological_score < 10:
        pdf.cell(200, 10, "4)Psychological Section: Low Risk", ln=True)
        pdf.cell(200, 10, "Description: Minimal stress and anxiety-related experiences.", ln=True)
    elif 11 <= psychological_score < 25:
        pdf.cell(200, 10, "4)Psychological Section: Moderate Risk", ln=True)
        pdf.cell(200, 10, "Description: Moderate levels of stress and anxiety; attention recommended.", ln=True)
    else:
        pdf.cell(200, 10, "4)Psychological Section: High Risk", ln=True)
        pdf.cell(200, 10, "Description: High levels of stress, anxiety, and moral distress; action advised", ln=True)

    pdf.ln(5)

    # Environmental Section
    if 0 <= environmental_score < 5:
        pdf.cell(200, 10, "5)Environmental Section: Low Risk", ln=True)
        pdf.cell(200, 10, "Description: Minimal exposure to environmental factors; low health risk.", ln=True)
    elif 6 <= environmental_score < 10:
        pdf.cell(200, 10, "5)Environmental Section: Moderate Risk", ln=True)
        pdf.cell(200, 10, "Description: Moderate exposure to environmental factors; some concern.", ln=True)
    else:
        pdf.cell(200, 10, "5)Environmental Section: High Risk", ln=True)
        pdf.cell(200, 10, "Description: High levels of exposure to environmental factors; urgent action needed.", ln=True)

    pdf.ln(20)

    # Vitiligo Assessment Section
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(0, 102, 204)  # Blue color
    pdf.cell(200, 10, "Vitiligo Assessment Section", ln=True)

    # Use try-except for determining vitiligo type
    try:
        vitiligo_type = determine_vitiligo_type(responses)
    except NameError:
        vitiligo_type = None

    pdf.set_font("Arial", '', 12)
    pdf.set_text_color(0, 0, 0)  # Black color
    if vitiligo_type:
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, "Type of Vitiligo:", ln=True)
        pdf.cell(200, 10, f"Type of Vitiligo: {vitiligo_type}", ln=True)
    else:
        pdf.cell(200, 10, "Type of Vitiligo: Unknown", ln=True)

    pdf.ln(20)  # Space before insights

    # Insights Section
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(0, 102, 204)  # Blue color
    pdf.cell(200, 10, "Insights:", ln=True)

    # Reset text color and set font size for the insights content
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", '', 12)

    # Handle insights with text wrapping
    for insight in insights:
        words = insight.split()
        line = ''
        for word in words:
            if pdf.get_string_width(line + word) < 180:
                line += word + ' '
            else:
                pdf.multi_cell(0, 5, line)
                line = word + ' '
        pdf.multi_cell(0, 5, line)
        pdf.ln(1)
    pdf.ln(20)  # Space before conclusion

    # Conclusion Section
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(0, 102, 204)  # Blue color
    pdf.cell(200, 10, "Conclusion:", ln=True)
    pdf.set_font("Arial", '', 12)
    pdf.set_text_color(0, 0, 0)  # Black color
    pdf.multi_cell(0, 10, conclusion)

    pdf.ln(20)

    # Risk Distribution Section
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(200, 10, "Risk Distribution:", ln=True)
    pdf.multi_cell(0, 10, "The following Pie chart narrates the information about contribution of each section "
                         "for a person having vitiligo, helping identify the actual cause of the disease.")

    # Add pie chart
    try:
        chart_path = create_pie_chart(family_score, diet_score, lifestyle_score, 
                                    psychological_score, environmental_score)
        pdf.image(chart_path, x=50, y=None, w=100, h=100)
    except Exception as e:
        pdf.multi_cell(0, 10, "Error generating pie chart: " + str(e))

    # Overall Diagnosis Section
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(0, 102, 204)
    pdf.cell(200, 10, "Overall Diagnosis", ln=True)

    pdf.set_font("Arial", 'B', 12)
    pdf.set_text_color(0, 0, 0)

    # Determine risk levels and add appropriate text
    if prediction == "Low Risk":
        pdf.cell(200, 10, "Overall Risk: Low Risk", ln=True)
        pdf.multi_cell(0, 10, "The assessment indicates that there is a low likelihood of vitiligo based on "
                             "the provided information. While maintaining a healthy lifestyle is important, "
                             "there are no significant risk factors present at this time.")
    elif prediction == "Moderate Risk":
        pdf.cell(200, 10, "Overall Risk: Moderate Risk", ln=True)
        pdf.multi_cell(0, 10, "The assessment suggests a moderate risk of vitiligo. While there are some risk factors "
                             "present, the likelihood is not high. It is advisable to monitor any changes and "
                             "consider consulting a healthcare professional for further evaluation.")
    else:  # High Risk
        pdf.cell(200, 10, "Overall Risk: High Risk", ln=True)
        pdf.multi_cell(0, 10, "The assessment points to a high risk of vitiligo based on significant risk factors, "
                             "including personal or family history. Immediate medical consultation is recommended "
                             "for early intervention and management.")

    # Image Diagnosis Section
    pdf.ln(20)
    pdf.set_font("Arial", 'B', 18)
    pdf.set_text_color(255, 0, 0)
    pdf.cell(200, 10, "Image Diagnosis Section:", ln=True)
    pdf.ln(10)

    # Add images with error handling
    def add_image_to_pdf(image_field, title):
        try:
            if image_field and hasattr(image_field, 'path'):
                # Get the actual path of the image file
                image_path = image_field.path
                
                # Add image to PDF with error handling
                try:
                    pdf.set_font("Arial", 'B', 14)
                    pdf.cell(200, 10, title, ln=True)
                    # Adjust image size while maintaining aspect ratio
                    img_width = 160  # Maximum width
                    pdf.image(image_path, x=25, y=pdf.get_y(), w=img_width)
                    # Add space after image
                    pdf.ln(120)  # Adjust this value based on your needs
                except Exception as e:
                    pdf.multi_cell(0, 10, f"Error processing {title}: {str(e)}")
            else:
                pdf.multi_cell(0, 10, f"{title} Not available")
        except Exception as e:
            pdf.multi_cell(0, 10, f"Error accessing {title}: {str(e)}")


    # Add all images
    add_image_to_pdf(image, "Uploaded Image")
    add_image_to_pdf(wood_lamp_image, "Wood's Lamp Effect")
    add_image_to_pdf(grayscale_image, "Grayscale Image")
    add_image_to_pdf(heatmap_image, "Heatmap of Potential Vitiligo Areas")

    # Disclaimer
    pdf.ln(20)
    pdf.set_font("Arial", '', 10)
    pdf.set_text_color(0, 0, 0)
    pdf.multi_cell(0, 10, "Disclaimer: This report is generated by AI-based software and is for informational purposes only. "
                         "It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice "
                         "of your physician or other qualified health provider with any questions you may have regarding a medical condition.")

    # Save the report
    try:
        pdf.output(report_path)
    except Exception as e:
        raise Exception(f"Error saving PDF: {str(e)}")

    return report_path


import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os
import logging

def send_email(receiver_email, pdf_file, patient_name):
    """
    Send an email with PDF attachment.
    
    Args:
        receiver_email (str): Recipient's email address
        pdf_file (str): Path to the PDF file
        patient_name (str): Name of the patient for the email body
    
    Returns:
        tuple: (bool, str) - (Success status, Message)
    """
    # Email configuration
    sender_email = "jmandar1322@gmail.com"
    EMAIL_PASSWORD = "rsai nmjq hsvo zqrm"  # Consider moving this to environment variables

    try:
        # Create email header
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = "Your Vitiligo Assessment Report"

        # Email body
        body = f"Hey {patient_name},\n\nPlease find your attached Vitiligo Assessment Report.\n\nBest regards,\nVitiligo Assessment Team"
        msg.attach(MIMEText(body, 'plain'))

        # Check if PDF file exists
        if not os.path.exists(pdf_file):
            return False, "PDF file not found"

        # Attach the PDF
        try:
            with open(pdf_file, "rb") as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f"attachment; filename= {os.path.basename(pdf_file)}"
                )
                msg.attach(part)
        except Exception as e:
            return False, f"Error attaching PDF: {str(e)}"

        # Create and send the email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()

        return True, "Email sent successfully"

    except smtplib.SMTPAuthenticationError:
        return False, "Email authentication failed. Please check your credentials."
    except smtplib.SMTPException as e:
        return False, f"SMTP error occurred: {str(e)}"
    except Exception as e:
        return False, f"An unexpected error occurred: {str(e)}"