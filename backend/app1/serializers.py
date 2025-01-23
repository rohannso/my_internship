from rest_framework import serializers
from .models import UploadedImage


class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'uploaded_at', 'prediction', 'confidence','user']
        read_only_fields = ['user']

from .models import FamilyHistory

class FamilyHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyHistory
        fields = '__all__'


#from .models import DietHistory

#class DietHistorySerializer(serializers.ModelSerializer):
#    class Meta:
#        model = DietHistory
#        fields = '__all__'

from .models import LifestyleAssessment, PsychologicalAssessment,VitiligoAssessment,EnvironmentalAssessment

class LifestyleAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LifestyleAssessment
        fields = '__all__'

class PsychologicalAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PsychologicalAssessment
        fields = '__all__'

class VitiligoAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitiligoAssessment
        fields = '__all__'

class EnvironmentalAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentalAssessment
        fields = '__all__'


from .models import *
class DietAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietAssessment
        fields = ['sour_foods', 'salty_foods', 'processed_foods', 
                 'incompatible_combinations', 'food_habits', 'oily_foods',
                 'meals_before_digestion', 'diet_score','user']
        read_only_fields = ['diet_score','user']


class VitiligoQuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitiligoQuestionnaire
        fields = ['id', 'face_spots', 'hand_feet_spots', 'arms_legs_spots', 'depigmentation', 'created_at','user']


from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'age', 'gender', 'email', 'assessment_date', 'report_path', 'user_d']
        read_only_fields = ['id', 'report_path', 'created_at', 'assessment_date']  # Made assessment_date read-only since it's auto_now_add

    def create(self, validated_data):
        validated_data['user_d'] = self.context['request'].user
        return super().create(validated_data)

    
    
class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'message']