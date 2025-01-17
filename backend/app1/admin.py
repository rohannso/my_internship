from django.contrib import admin

# Register your models here.
from .models import UploadedImage
from .models import FamilyHistory
from .models import LifestyleAssessment
from .models import PsychologicalAssessment
from .models import VitiligoAssessment
from .models import  EnvironmentalAssessment
from .models import DietAssessment
admin.site.register(UploadedImage)

admin.site.register(FamilyHistory)
admin.site.register(LifestyleAssessment)
admin.site.register(PsychologicalAssessment)
admin.site.register(VitiligoAssessment)
admin.site.register(EnvironmentalAssessment)
admin.site.register(DietAssessment)
