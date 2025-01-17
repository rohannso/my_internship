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
from rest_framework import status
import pickle
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




def load_svc_model():
    # Full absolute path to the model file
    model_path = 'E:/Development of Projects/THE BIG GOOD PROJECTS/Turing Tech Labs/Vitiligo_rohan/Vitiligo/backend/vitiligo_backend/vitiligo_backend/best.pkl'
    
    with open(model_path, 'rb') as file:
        svc_model = pickle.load(file)
    
    return svc_model


# Load the model at a global level
svc_model = load_svc_model()

def calculate_combined_score(family_score, diet_score, lifestyle_score, psychological_score, environmental_score):
    combined_score = family_score + diet_score + lifestyle_score + psychological_score + environmental_score
    return combined_score

@api_view(['POST'])
def submit_family_history(request):
    try:
        # Debug: Print the received request data
        print(request.data)  # Log the request data

        # Capture family history information from the request
        family_history_skin_disorders = int(request.data.get('family_history_skin_disorders', 0))
        family_history_depigmentation = int(request.data.get('family_history_depigmentation', 0))
        personal_history_autoimmune = int(request.data.get('personal_history_autoimmune', 0))

        # Calculate family score (simple sum of responses)
        family_score = family_history_skin_disorders + family_history_depigmentation + personal_history_autoimmune

        # Prepare the input data in the same format the model expects (with feature names)
        input_data = pd.DataFrame([{
            'family_history_skin_disorders': family_history_skin_disorders,
            'family_history_depigmentation': family_history_depigmentation,
            'personal_history_autoimmune': personal_history_autoimmune
        }])

        # Make prediction using the SVC model
        prediction = svc_model.predict(input_data)

        # Send response with the family score and prediction
        return Response({
            'message': 'Data submitted successfully!',
            'family_score': family_score,
            'prediction': prediction.tolist(),  # Convert numpy array to list for response
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error
        return Response({
            'error': f"An error occurred: {str(e)}",
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def submit_diet_history(request):
    try:
        # Debug: Log the received request data
        print("Received Data:", request.data)

        # Extract the received data
        responses = request.data

        # Example: Parsing nested structure if `sour_foods` is a list of dictionaries
        sour_foods_score = sum(
            2 * (1 if food['days'] == '1-3' else 2 if food['days'] == '3-5' else 3)
            for food in responses.get('sour_foods', [])
        )
        salty_foods_score = sum(
            2 * (1 if food['days'] == '1-3' else 2 if food['days'] == '3-5' else 3)
            for food in responses.get('salty_foods', [])
        )
        processed_foods_score = sum(
            2 * (1 if food['days'] == '1-3' else 2 if food['days'] == '3-5' else 3)
            for food in responses.get('processed_foods', [])
        )
        incompatible_combinations_score = sum(
            3 * (2 if combo['days'] == '1-3' else 4 if combo['days'] == '3-5' else 6)
            for combo in responses.get('incompatible_combinations', [])
        )
        food_habits_score = sum(
            1 * (1 if habit['days'] == '1-3' else 2 if habit['days'] == '3-5' else 3)
            for habit in responses.get('food_habits', [])
        )
        oily_foods_score = sum(
            1 * (1 if oily_food['days'] == '1-3' else 2 if oily_food['days'] == '3-5' else 3)
            for oily_food in responses.get('oily_foods', [])
        )
        meals_before_digestion_score = 6 if responses.get('meals_before_digestion') == 'Yes' else 0

        # Calculate total diet score
        diet_score = (
            sour_foods_score
            + salty_foods_score
            + processed_foods_score
            + incompatible_combinations_score
            + food_habits_score
            + oily_foods_score
            + meals_before_digestion_score
        )

        # Optionally save to the database
        DietHistory.objects.create(
            sour_foods=responses.get('sour_foods', []),
            salty_foods=responses.get('salty_foods', []),
            processed_foods=responses.get('processed_foods', []),
            incompatible_combinations=responses.get('incompatible_combinations', []),
            food_habits=responses.get('food_habits', []),
            oily_foods=responses.get('oily_foods', []),
            meals_before_digestion=responses.get('meals_before_digestion', ''),
            diet_score=diet_score,
        )

        # Return a successful response
        return Response({
            'message': 'Diet history submitted successfully!',
            'diet_score': diet_score,
        }, status=status.HTTP_201_OK)

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        return Response({
            'error': f"An error occurred: {str(e)}",
        }, status=status.HTTP_400_BAD_REQUEST)


