from rest_framework import serializers
from .models import UploadedImage


class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'uploaded_at', 'prediction', 'confidence']

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


from .models import DietAssessment
class DietAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietAssessment
        fields = ['sour_foods', 'salty_foods', 'processed_foods', 
                 'incompatible_combinations', 'food_habits', 'oily_foods',
                 'meals_before_digestion', 'diet_score']
        read_only_fields = ['diet_score']