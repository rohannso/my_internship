
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class LoginAPIView(APIView):
    def post(self, request):
        # Check if the request content type is JSON
        if not request.content_type == 'application/json':
            return Response({'message': 'Request content type must be application/json'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure that email and password are present in the request
        if 'email' not in request.data or 'password' not in request.data:
            return Response({'message': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get('email')
        password = request.data.get('password')
        # Extract username from email
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            return Response({'message': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        # Authenticate user with email and password
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)  # This logs the user in by creating a session
            return Response({'message': 'Login successful','userId': user.id}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    #username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if  not email or not password:
        return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the user already exists
    #if User.objects.filter(username=username).exists():
    #    return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = User.objects.create_user( username=email,email=email ,password=password)
    user.save()

    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import *

from rest_framework.permissions import IsAuthenticated
class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        print(request.data)  # Log the request data
        serializer = UploadedImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        print(serializer.errors)  # Log serializer errors
        return Response(serializer.errors, status=400)




from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UploadedImage
from .serializers import UploadedImageSerializer
from .utils import *  # Import the utility function
import cv2
from django.core.files.base import ContentFile
import base64
class ImageProcessingView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            # Fetch the uploaded image by ID
            uploaded_image = UploadedImage.objects.get(pk=pk)
            image_path = uploaded_image.image.path

            # Read the image using OpenCV
            image = cv2.imread(image_path)

            # Apply Wood's Lamp Effect
            wood_lamp_effect, contrast_enhanced = apply_wood_lamp_effect(image)
            if contrast_enhanced is None:
                print("Contrast enhancement failed.")

            # Create a heatmap
            heatmap = create_heatmap(contrast_enhanced)

            # Predict using the ML model
            label, confidence,pre = predict_image(image_path)
            def save_image_to_model(img, field_name):
                _, img_encoded = cv2.imencode('.jpg', img)
                if img_encoded is None:
                    print(f"Error encoding {field_name}")
                    return None
                img_bytes = img_encoded.tobytes()
                file = ContentFile(img_bytes, name=f"{field_name}_{uploaded_image.pk}.jpg")
                setattr(uploaded_image, field_name, file)

            save_image_to_model(wood_lamp_effect, "wood_lamp")
            save_image_to_model(heatmap, "heatmap")
            save_image_to_model(contrast_enhanced, "grayscale")

            # Save prediction results to the database
            uploaded_image.prediction = label
            uploaded_image.predicted_val=pre
            uploaded_image.confidence = confidence
            uploaded_image.save()

            # Convert results to base64 for API response
            def encode_image(img):
                _, img_encoded = cv2.imencode('.jpg', img)
                if img_encoded is None:
                    print("Error: Image encoding failed.")
                return base64.b64encode(img_encoded).decode('utf-8')
            

            wood_lamp_base64 = encode_image(wood_lamp_effect)
            heatmap_base64 = encode_image(heatmap)
            grayscale_base64 = encode_image(contrast_enhanced)
            

            return Response({
                "prediction": label,
                "confidence": confidence,
                "wood_lamp_effect": wood_lamp_base64,
                "heatmap": heatmap_base64,
                "grayscale_image": grayscale_base64,
                "pre":pre
            }, status=200)

        except UploadedImage.DoesNotExist:
            return Response({"error": "Image not found"}, status=404)
        

class FamilyHistoryView(APIView):
    #permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        print(data)
        user_id = data.get('userId')
        try:
            user = User.objects.get(id=user_id)  # Convert userId to User instance
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


        # Calculate the total score
        total_score = (
            int(data.get('family_history_skin_disorders', 0)) +
            int(data.get('family_history_depigmentation', 0)) +
            int(data.get('personal_history_autoimmune', 0))
        )
        print(user.id)
        

        serializer_data = {
            **data,
            "family_score": total_score,
            #"user": user.id # Add the user ID here
        }

        # Optionally save data
        serializer = FamilyHistorySerializer(data={**data, "family_score": total_score})
        if serializer.is_valid():
            serializer.save(user=user)
        return Response(serializer_data, status=status.HTTP_200_OK)
    

from rest_framework.viewsets import ModelViewSet
from .models import LifestyleAssessment
from .serializers import LifestyleAssessmentSerializer
class LifestyleAssessmentView(APIView):
    def post(self, request):
        data = request.data
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        print(data)

        # Calculate the total score
        total_score = sum(
            int(data.get(f'question{i}', 0)) 
            for i in range(1, 11)
        )

        response_data = {
            "total_score": total_score,
        }

        # Optionally save data
        serializer = LifestyleAssessmentSerializer(data={**data, "total_score": total_score})
        if serializer.is_valid():
            serializer.save(user=user)

        return Response(response_data, status=status.HTTP_200_OK)




class PsychologicalAssessmentView(APIView):
    def post(self, request):
        data = request.data
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)


        # Calculate the total score
        total_score = sum(
            int(data.get(f'question{i}', 0)) 
            for i in range(1, 11)
        )

        # Calculate risk level based on total score
        #risk_level = self.calculate_risk_level(total_score)

        response_data = {
            "total_score": total_score,
            #"risk_level": risk_level,
        }

        # Optionally save data
        serializer = PsychologicalAssessmentSerializer(data={**data, "total_score": total_score})
        if serializer.is_valid():
            serializer.save(user=user)

        return Response(response_data, status=status.HTTP_200_OK)
    

    

from .serializers import VitiligoAssessmentSerializer

class VitiligoAssessmentView(APIView):
    def post(self, request):
        data = request.data
        user_id=data.get('user_id')
        user=User.objects.get(id=user_id)

        # Calculate the total score
        total_score = sum(
            int(data.get(f'question{i}', 0)) 
            for i in range(1, 9)
        )

        # Calculate risk level based on total score (Optional)
        # risk_level = self.calculate_risk_level(total_score)

        response_data = {
            "total_score": total_score,
            # "risk_level": risk_level,
        }

        # Optionally save data
        serializer = VitiligoAssessmentSerializer(data={**data, "total_score": total_score})
        if serializer.is_valid():
            serializer.save(user=user)

        return Response(response_data, status=status.HTTP_200_OK)
        
class EnvironmentalAssessmentView(APIView):
    def post(self, request):
        data = request.data
        print(data)
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)


        # Calculate the total score based on the responses
        total_score = sum(
            int(data.get(f'question{i}', 0)) 
            for i in range(1, 5)  # Questions 1 to 4
        )

        # Optionally, add any business logic for risk levels based on total_score (if needed)

        response_data = {
            "total_score": total_score,
        }
        serializer = EnvironmentalAssessmentSerializer(data={**data, "total_score": total_score})
        if serializer.is_valid():
            serializer.save(user=user)

        # Optionally, save data to the database if needed
        # serializer = EnvironmentalAssessmentSerializer(data={**data, "total_score": total_score})
        # if serializer.is_valid():
        #     serializer.save()

        return Response(response_data, status=status.HTTP_200_OK)

from django.http import JsonResponse    

from .utils import *


def get_risk_prediction(request):   
    try:
        user = request.user if request.user.is_authenticated else None
        # Fetch the latest scores from the database
        latest_deit_history=DietAssessment.objects.filter(user=user).latest('id')
        latest_family_history = FamilyHistory.objects.filter(user=user).latest('id')
        latest_lifestyle_assessment = LifestyleAssessment.objects.filter(user=user).latest('id')
        latest_psychological_assessment = PsychologicalAssessment.objects.filter(user=user).latest('id')
        latest_environmental_assessment = EnvironmentalAssessment.objects.filter(user=user).latest('id')
        latest_image = UploadedImage.objects.filter(user=user).latest('id')
        

        # Extract individual scores
        family_score = latest_family_history.family_score
        lifestyle_score = latest_lifestyle_assessment.total_score
        psychological_score = latest_psychological_assessment.total_score
        environmental_score = latest_environmental_assessment.total_score
        diet_score=latest_deit_history.diet_score
        



        # Set diet score (if it's not calculated yet)
        # Calculate combined score
        combined_score = calculate_combined_score(
            diet_score, environmental_score, lifestyle_score, psychological_score, family_score
        )

        # Predict vitiligo risk
        risk_prediction = predict_vitiligo_risk(
            diet_score, environmental_score, lifestyle_score, psychological_score, family_score, combined_score
        )

        # Generate the pie chart
        chart_path = create_pie_chart(
            family_score, diet_score, lifestyle_score, psychological_score, environmental_score
        )

        # Serve chart URL
        chart_url = f"/media/charts/{os.path.basename(chart_path)}"

        # Response with pie chart URL
        response = {
            "diet_score": diet_score,
            "environmental_score": environmental_score,
            "lifestyle_score": lifestyle_score,
            "psychological_score": psychological_score,
            "family_score": family_score,
            "combined_score": combined_score,
            "risk_prediction": risk_prediction,
            "chart_url": chart_url,
            
        }
        return JsonResponse(response)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from .models import *
class DietAssessmentCreateView(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            print(request.data)
            user_id = request.data.get('user_id')
            user = User.objects.get(id=user_id)


            # Extract data from request
            diet_data = {
                'user': user,
                'sour_foods': request.data.get('sour_foods', []),
                'salty_foods': request.data.get('salty_foods', []),
                'processed_foods': request.data.get('processed_foods', []),
                'incompatible_combinations': request.data.get('incompatible_combinations', []),
                'food_habits': request.data.get('food_habits', []),
                'oily_foods': request.data.get('oily_foods', []),
                'meals_before_digestion': request.data.get('meals_before_digestion') == 'Yes'
            }

            # Create diet assessment
            diet_assessment = DietAssessment.objects.create(
        
                **diet_data
            )
            
            # Calculate score automatically via model's save method
            diet_assessment.save()

            # Get user's family history
            #family_history = request.user.familyhistory_set.first()

            # Create full assessment
            

            return Response({
                'message': 'Diet assessment created successfully',
                'diet_score': diet_assessment.diet_score,
                #'total_score': assessment.total_score
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


import json
class QuestionnaireView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            print(data)
            user_id = request.data.get('user_id')
            user = User.objects.get(id=user_id)
            serializer = VitiligoQuestionnaireSerializer(data={
                'face_spots': data.get('face_spots', []),
                'hand_feet_spots': data.get('hand_feet_spots', []),
                'arms_legs_spots': data.get('arms_legs_spots', []),
                'depigmentation': data.get('depigmentation', [])
            })
            
            if serializer.is_valid():
                serializer.save(user=user)
                return JsonResponse({
                    'message': 'Questionnaire submitted successfully',
                    'data': serializer.data
                }, status=201)
            
            return JsonResponse({
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=400)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'message': 'Invalid JSON'
            }, status=400)
            
        except Exception as e:
            return JsonResponse({
                'message': 'Error submitting questionnaire',
                'error': str(e)
            }, status=500)

from rest_framework import viewsets
from rest_framework.authentication import BasicAuthentication
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print(request.user)
        data = request.data.copy()
        
        # No need to add user_d here since serializer handles it
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            patient = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)




        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from django.shortcuts import get_object_or_404
from .utils import generate_vitiligo_report

def get_assessment_insights(assessment_id):
    """
    Fetch vitiligo assessment data and generate insights and conclusions.
    """
    try:
        # Fetch the assessment record
        assessment = VitiligoAssessment.objects.get(id=assessment_id)
        
        # Define mappings for converting numeric values to expected string inputs
        WHITE_PATCHES_MAP = {
            1: 'No',
            2: 'Yes'  # Updated values
        }
        
        PATCH_SHAPE_MAP = {
            1: 'Uncertain',
            2: 'Round',
            3: 'Oval',
            4: 'Irregular'  # Updated values
        }
        
        EXPANDING_PATCHES_MAP = {
            1: 'Uncertain',
            2: 'No, they have remained the same size',
            3: 'Yes, they are growing'  # Updated values
        }
        
        PATCH_DURATION_MAP = {
            1: 'Uncertain',
            2: 'Less than 3 months',
            3: '3-6 months',
            4: '6-12 months',
            5: 'More than 1 year'  # Updated values
        }
        
        SENSATIONS_MAP = {
            1: 'No, no sensations',
            2: 'Yes, itching',
            3: 'Yes, pain',
            4: 'Yes, both itching and pain'  # Updated values
        }
        
        COLOR_CHANGE_MAP = {
            1: 'No change',
            2: 'Yes, they have lightened over time'  # Updated values
        }
        
        NEW_PATCHES_MAP = {
            1: 'No',
            2: 'Yes, within the last 3 months'  # Updated values
        }
        
        VISIBILITY_MAP = {
            1: 'No change',
            2: 'Yes, they are more noticeable'  # Updated values
        }

        # Print values for debugging
        print(f"Question values:", {
            'q1': assessment.question1,
            'q2': assessment.question2,
            'q3': assessment.question3,
            'q4': assessment.question4,
            'q5': assessment.question5,
            'q6': assessment.question6,
            'q7': assessment.question7,
            'q8': assessment.question8
        })
        
        # Convert the numeric values to strings using the mappings with validation
        input_data = {}
        
        def safe_map(value, mapping, field_name):
            if value not in mapping:
                print(f"Invalid value {value} for {field_name}")
                # Provide default values if mapping fails
                return list(mapping.values())[0]
            return mapping[value]
        
        input_data = {
            'white_patches': safe_map(assessment.question1, WHITE_PATCHES_MAP, 'white_patches'),
            'patch_shape': safe_map(assessment.question2, PATCH_SHAPE_MAP, 'patch_shape'),
            'expanding_patches': safe_map(assessment.question3, EXPANDING_PATCHES_MAP, 'expanding_patches'),
            'patch_duration': safe_map(assessment.question4, PATCH_DURATION_MAP, 'patch_duration'),
            'sensations': safe_map(assessment.question5, SENSATIONS_MAP, 'sensations'),
            'color_change': safe_map(assessment.question6, COLOR_CHANGE_MAP, 'color_change'),
            'new_patches': safe_map(assessment.question7, NEW_PATCHES_MAP, 'new_patches'),
            'visibility_in_sunlight': safe_map(assessment.question8, VISIBILITY_MAP, 'visibility_in_sunlight')
        }
        
        print("Processed input data:", input_data)
        
        # Generate insights and conclusion
        insights, conclusion = generate_insights_and_conclusion(**input_data)
        
        return insights, conclusion
        
    except VitiligoAssessment.DoesNotExist:
        raise Exception(f"Assessment with ID {assessment_id} not found")
    except Exception as e:
        raise Exception(f"Error processing assessment data: {str(e)}")
from datetime import date

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny

class GenerateReportAPIView(APIView):
    def post(self, request, patient_id):
        authentication_classes = [BasicAuthentication]
        permission_classes = [IsAuthenticated]
        print("Request reached view")
        print("User authenticated:", request.user.is_authenticated)
        print("User:", request.user)
        print("Session:", request.session.items())
        #permission_classes = [AllowAny] 
        try:

            # Check patient exists and belongs to user - using user_d instead of user
            try:
                patient = Patient.objects.get(id=patient_id, user_d=request.user)
                patient_name=patient.name
                age=patient.age
                gender=patient.gender
                date_t = date.today()

            except Patient.DoesNotExist:
                return Response(
                    {"error": "Patient not found or access denied"},
                    status=status.HTTP_404_NOT_FOUND
                )
            

            # Get latest assessments
            try:
                latest_diet = DietAssessment.objects.filter(user=request.user).latest('id')
                latest_family = FamilyHistory.objects.filter(user=request.user).latest('id')
                latest_lifestyle = LifestyleAssessment.objects.filter(user=request.user).latest('id')
                latest_psychological = PsychologicalAssessment.objects.filter(user=request.user).latest('id')
                latest_environmental = EnvironmentalAssessment.objects.filter(user=request.user).latest('id')
                latest_image = UploadedImage.objects.filter(user=request.user).latest('id')
                assessment = VitiligoAssessment.objects.filter(user=request.user).latest('id')
                #print(f"Assessment ID: {assessment.id}")

                # Extract scores
                family_score = latest_family.family_score
                lifestyle_score = latest_lifestyle.total_score
                psychological_score = latest_psychological.total_score
                environmental_score = latest_environmental.total_score
                diet_score = latest_diet.diet_score
                image=latest_image.image
                wood = latest_image.wood_lamp
                heat = latest_image.heatmap
                grayscaled = latest_image.grayscale
                label=latest_image.prediction
                prediction=latest_image.prediction

                questionnaire = VitiligoQuestionnaire.objects.filter(user=request.user).latest('created_at')
                responses = {
                    'face': questionnaire.face_spots,
                    'hands_feet': questionnaire.hand_feet_spots,
                    'arms_legs': questionnaire.arms_legs_spots,
                    'whole_body': questionnaire.depigmentation
                }
                
                vitiligo_type = determine_vitiligo_type(responses)
                insights, conclusion = get_assessment_insights(assessment.id)

            except Exception as e:
                return Response(
                    {"error": "Could not fetch assessment data", "details": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            combined_score=diet_score+family_score+psychological_score+environmental_score+lifestyle_score
            report_path=generate_vitiligo_report(patient_name, age, gender, date_t, diet_score, environmental_score, lifestyle_score, 
                           psychological_score, family_score, combined_score, prediction, insights, conclusion,
                           image, wood, heat, grayscaled, label)
            relative_path = os.path.relpath(report_path, settings.BASE_DIR)
            patient.report_path=relative_path
            patient.save()
            print(patient.email+" "+patient.report_path)
            if hasattr(patient, 'email') and patient.email:
                success, message = send_email(
                    receiver_email=patient.email,
                    pdf_file=report_path,
                    patient_name=patient_name
                )
                
                if not success:
                    # Log the error but don't stop the response
                    logging.error(f"Failed to send email: {message}")



            

            return Response({
                "user": {
                    "id": patient.id,
                    "name": patient.name,
                    "age": patient.age,
                    "gender": patient.gender,
                    "diet_score": diet_score,
                    "family_score": family_score,
                    "lifestyle_score": lifestyle_score,
                    "psychological_score": psychological_score,
                    "environmental_score": environmental_score,
                },
                "vitiligo_type": vitiligo_type,
                "insights": insights,
                "conclusion": conclusion,
                
            })
            

        except Exception as e:
            return Response({
                "error": "Unexpected error occurred",
                "details": str(e),
                "type": type(e).__name__
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from django.http import HttpResponse

@api_view(['GET'])
def download_report(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id, user_d=request.user)
        if not patient.report_path:
            return Response({'error': 'Report not found'}, status=404)
            
        file_path = os.path.join(settings.BASE_DIR, patient.report_path)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename=patient_report_{patient.name}.pdf'
                return response
        return Response({'error': 'File not found'}, status=404)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=404)
    

@api_view(['POST'])
def submit_contact(request):
    
    serializer = ContactSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        # Save the contact submission
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        contact = serializer.save(user=user)
        
        
        return Response({
            'message': 'Submission successful', 
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)