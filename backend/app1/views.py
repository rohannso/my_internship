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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

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
        print(user)

        if user is not None:
            login(request, user)  # This logs the user in by creating a session
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the user already exists
    if User.objects.filter(username=username).exists():
        return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import *



class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        print(request.data)  # Log the request data
        serializer = UploadedImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)  # Log serializer errors
        return Response(serializer.errors, status=400)




from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UploadedImage
from .serializers import UploadedImageSerializer
from .utils import *  # Import the utility function
import cv2

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
            label, confidence = predict_image(image_path)

            # Save prediction results to the database
            uploaded_image.prediction = label
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
            }, status=200)

        except UploadedImage.DoesNotExist:
            return Response({"error": "Image not found"}, status=404)
        

class FamilyHistoryView(APIView):
    def post(self, request):
        data = request.data

        # Calculate the total score
        total_score = (
            int(data.get('family_history_skin_disorders', 0)) +
            int(data.get('family_history_depigmentation', 0)) +
            int(data.get('personal_history_autoimmune', 0))
        )
        

        response_data = {
            "family_score": total_score,
        }

        # Optionally save data
        serializer = FamilyHistorySerializer(data={**data, "family_score": total_score})
        if serializer.is_valid():
            serializer.save()

        return Response(response_data, status=status.HTTP_200_OK)
    

from rest_framework.viewsets import ModelViewSet
from .models import LifestyleAssessment
from .serializers import LifestyleAssessmentSerializer
class LifestyleAssessmentView(APIView):
    def post(self, request):
        data = request.data

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
            serializer.save()

        return Response(response_data, status=status.HTTP_200_OK)




class PsychologicalAssessmentView(APIView):
    def post(self, request):
        data = request.data

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
            serializer.save()

        return Response(response_data, status=status.HTTP_200_OK)
    

    

from .serializers import VitiligoAssessmentSerializer

class VitiligoAssessmentView(APIView):
    def post(self, request):
        data = request.data

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
            serializer.save()

        return Response(response_data, status=status.HTTP_200_OK)

class EnvironmentalAssessmentView(APIView):
    def post(self, request):
        data = request.data

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
            serializer.save()

        # Optionally, save data to the database if needed
        # serializer = EnvironmentalAssessmentSerializer(data={**data, "total_score": total_score})
        # if serializer.is_valid():
        #     serializer.save()

        return Response(response_data, status=status.HTTP_200_OK)

from django.http import JsonResponse    

from .utils import *

def get_risk_prediction(request):   
    try:
        # Fetch the latest scores from the database
        latest_deit_history=DietAssessment.objects.latest('id')
        latest_family_history = FamilyHistory.objects.latest('id')
        latest_lifestyle_assessment = LifestyleAssessment.objects.latest('id')
        latest_psychological_assessment = PsychologicalAssessment.objects.latest('id')
        latest_environmental_assessment = EnvironmentalAssessment.objects.latest('id')

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
            # Extract data from request
            diet_data = {
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
                #user=request.user,
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



