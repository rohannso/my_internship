from django.db import models
from django.contrib.auth.models import User

class UploadedImage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    image = models.ImageField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    prediction = models.CharField(max_length=255, null=True, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    wood_lamp=models.ImageField(upload_to='uploads/',null=True)
    heatmap=models.ImageField(upload_to='uploads/',null=True)
    grayscale=models.ImageField(upload_to='uploads/',null=True)
   





    def __str__(self):
        return f"Image {self.id}: {self.image.name} "
    
from django.core.validators import MinValueValidator, MaxValueValidator

class Patient(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    user_d = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patients')
    name = models.CharField(max_length=100)
    age = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(150)]
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    email = models.EmailField()
    #phone = models.CharField(max_length=15, blank=True, null=True)
    assessment_date = models.DateField(auto_now_add=True)
   
    report_path = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    #updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
     

    def __str__(self):
        return f"{self.name} {self.user_d.get_full_name()}"
    

from django.db import models



class FamilyHistory(models.Model):
    

    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    family_history_skin_disorders = models.IntegerField()
    family_history_depigmentation = models.IntegerField()
    personal_history_autoimmune = models.IntegerField()
    family_score = models.IntegerField()

    def __str__(self):
        return f"Family Score: {self.family_score}"

from django.contrib.auth.models import User

class DietAssessment(models.Model):
    DAYS_CHOICES = [
        ('1-3', '1-3 Days'),
        ('3-5', '3-5 Days'),
        ('5-7', '5-7 Days'),
    ]
    
    #user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Food items with days consumed
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)  
    sour_foods = models.JSONField(default=list)  # List of dicts with 'name' and 'days'
    salty_foods = models.JSONField(default=list)
    processed_foods = models.JSONField(default=list)
    incompatible_combinations = models.JSONField(default=list)
    food_habits = models.JSONField(default=list)
    oily_foods = models.JSONField(default=list)
    
    # Additional fields
    meals_before_digestion = models.BooleanField(default=False)
    diet_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_score(self):
        total_score = 0
        
        # Calculate score for sour foods
        for food in self.sour_foods:
            days_multiplier = 1 if food['days'] == '1-3' else 2 if food['days'] == '3-5' else 3
            total_score += 2 * days_multiplier
        
        # Calculate score for salty foods
        for food in self.salty_foods:
            days_multiplier = 1 if food['days'] == '1-3' else 2 if food['days'] == '3-5' else 3
            total_score += 2 * days_multiplier
            
        # Calculate score for processed foods
        for food in self.processed_foods:
            days_multiplier = 1 if food['days'] == '1-3' else 2 if food['days'] == '3-5' else 3
            total_score += 2 * days_multiplier
            
        # Calculate score for incompatible combinations
        for combo in self.incompatible_combinations:
            days_multiplier = 1 if combo['days'] == '1-3' else 2 if combo['days'] == '3-5' else 3
            total_score += 3 * (2 * days_multiplier)
            
        # Calculate score for food habits
        for habit in self.food_habits:
            days_multiplier = 1 if habit['days'] == '1-3' else 2 if habit['days'] == '3-5' else 3
            total_score += 1 * days_multiplier
            
        # Calculate score for oily foods
        for food in self.oily_foods:
            days_multiplier = 1 if food['days'] == '1-3' else 2 if food['days'] == '3-5' else 3
            total_score += 1 * days_multiplier
            
        # Add score for meals before digestion
        if self.meals_before_digestion:
            total_score += 6
            
        return total_score

    def save(self, *args, **kwargs):
        self.diet_score = self.calculate_score()
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Deit Assessment - Score: {self.diet_score}" 
    
class LifestyleAssessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    suppress_urges = models.IntegerField(default=0)
    heavy_exercise = models.IntegerField(default=0)
    sleep_after_meal = models.IntegerField(default=0)
    day_sleep = models.IntegerField(default=0)
    exhausted = models.IntegerField(default=0)
    insomnia = models.IntegerField(default=0)
    workout_after_meal = models.IntegerField(default=0)
    heavy_food_after_fasting = models.IntegerField(default=0)
    cold_bath = models.IntegerField(default=0)
    eat_with_fear = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)

    def calculate_total_score(self):
        self.total_score = sum([
            self.suppress_urges,
            self.heavy_exercise,
            self.sleep_after_meal,
            self.day_sleep,
            self.exhausted,
            self.insomnia,
            self.workout_after_meal,
            self.heavy_food_after_fasting,
            self.cold_bath,
            self.eat_with_fear
        ])
        self.save()
        return self.total_score

    def __str__(self):
        return f"Lifestyle Assessment - Score: {self.total_score}"
    

class PsychologicalAssessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    stress_anxiety = models.IntegerField(default=0)          # question1
    grief_sadness = models.IntegerField(default=0)          # question2
    anger_frustration = models.IntegerField(default=0)      # question3
    mental_exhaustion = models.IntegerField(default=0)      # question4
    guilt_distress = models.IntegerField(default=0)         # question5
    family_work_conflicts = models.IntegerField(default=0)  # question6
    disrespectful_behavior = models.IntegerField(default=0) # question7
    unethical_actions = models.IntegerField(default=0)      # question8
    taking_from_others = models.IntegerField(default=0)     # question9
    stressful_events = models.IntegerField(default=0)       # question10
    total_score = models.IntegerField(default=0)

    def calculate_total_score(self):
        self.total_score = sum([
            self.stress_anxiety,
            self.grief_sadness,
            self.anger_frustration,
            self.mental_exhaustion,
            self.guilt_distress,
            self.family_work_conflicts,
            self.disrespectful_behavior,
            self.unethical_actions,
            self.taking_from_others,
            self.stressful_events
        ])
        self.save()
        return self.total_score

    def __str__(self):
        return f"Psychological Assessment - Score: {self.total_score}"
    




class VitiligoAssessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    # Fields for the answers to each question (same as in the form you provided)
    question1 = models.IntegerField(default=0)  # Question 1: Do you have any white patches on your skin?
    question2 = models.IntegerField(default=0)  # Question 2: What is the shape of the white patches?
    question3 = models.IntegerField(default=0)  # Question 3: Are the white patches expanding over time?
    question4 = models.IntegerField(default=0)  # Question 4: How long have you had the white patches?
    question5 = models.IntegerField(default=0)  # Question 5: Do you experience any sensations (e.g., itching, pain)?
    question6 = models.IntegerField(default=0)  # Question 6: Have the patches changed in color over time?
    question7 = models.IntegerField(default=0)  # Question 7: Have you noticed any new white patches recently?
    question8 = models.IntegerField(default=0)  # Question 8: Do the patches become more noticeable in sunlight?

    # Total score field
    total_score = models.IntegerField(default=0)

    def calculate_total_score(self):
        # Method to calculate the total score based on the responses to all 8 questions
        self.total_score = sum([
            self.question1,
            self.question2,
            self.question3,
            self.question4,
            self.question5,
            self.question6,
            self.question7,
            self.question8
        ])
        self.save()
        return self.total_score

    def __str__(self):
        # Return a string representation with the total score
        return f"Vitiligo Assessment - Score: {self.total_score}"


class EnvironmentalAssessment(models.Model):
    # Question 1: Are you exposed to chemicals or industrial pollutants at work?
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    chemical_exposure = models.IntegerField(default=0)  # Question 1
    
    # Question 2: Do you live or work in a highly polluted area?
    polluted_area = models.IntegerField(default=0)  # Question 2
    
    # Question 3: Have you used any harsh chemicals or skin products in recent months?
    harsh_chemicals = models.IntegerField(default=0)  # Question 3
    
    # Question 4: Do you frequently spend long hours in direct sunlight without skin protection?
    sunlight_exposure = models.IntegerField(default=0)  # Question 4
    
    # Total score to be calculated
    total_score = models.IntegerField(default=0)

    def calculate_total_score(self):
        """
        This method calculates the total score based on the responses to the questions.
        It sums up the values of all the responses and updates the `total_score` field.
        """
        self.total_score = sum([
            self.chemical_exposure,
            self.polluted_area,
            self.harsh_chemicals,
            self.sunlight_exposure
        ])
        self.save()  # Save the model with the updated total score
        return self.total_score

    def __str__(self):
        return f"Environmental Assessment - Score: {self.total_score}"
    
    
from django.db import models

class VitiligoQuestionnaire(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    # Face spots (stored as JSON array of selected options)
    face_spots = models.JSONField(default=list, blank=True)
    
    # Hand/Feet spots
    hand_feet_spots = models.JSONField(default=list, blank=True)
    
    # Arms/Legs spots
    arms_legs_spots = models.JSONField(default=list, blank=True)
    
    # Depigmentation status
    depigmentation = models.JSONField(default=list, blank=True)
    
    # Timestamp for when the questionnaire was submitted
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Questionnaire {self.id} submitted at {self.created_at}"
    

from django.db import models
from django.contrib.auth.models import User

    

from django.db import models

class ContactSubmission(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='contactuser',null=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
