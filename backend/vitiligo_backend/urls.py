"""
URL configuration for vitiligo_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app1.views import LoginAPIView
from app1.views import register_user
from django.urls import path
from app1.views import *
from app1.views import GenerateReportAPIView


patient_list = PatientViewSet.as_view({ 'post': 'create'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('api/register/', register_user, name='register_user'),
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
    path('predict/<int:pk>/', ImageProcessingView.as_view(), name='image-predict'),
    path('api/submit_family_history/', FamilyHistoryView.as_view(), name='submit_family_history'),
    #path('api/submit_diet_history/', DietHistoryView.as_view(), name='submit_diet_history'),
    path('api/submit_lifestyle_assessment/', LifestyleAssessmentView.as_view(), name='submit_lifestyle_assessment'),
    path('api/submit_psychological_assessment/', PsychologicalAssessmentView.as_view(), name='submit_psychological_assessment'),
    path('api/vitiligo-assessment/', VitiligoAssessmentView.as_view(), name='vitiligo-assessment'),
    path('api/EnvironmentalAssessment/', EnvironmentalAssessmentView.as_view(),name='EnvironmentalAssessmentView'),
    path('api/predict-risk/', get_risk_prediction, name='predict-risk'),
    path('api/diet-assessment/create/', DietAssessmentCreateView.as_view(), name='diet-assessment-create'),
    path('api/questionnaire/submit/', QuestionnaireView.as_view(), name='submit-questionnaire'),
    path('api/patients/create/', patient_list, name='patient-create'),
    path('api/report/<int:patient_id>/',GenerateReportAPIView.as_view(),name='report'),
    path('download-report/<int:patient_id>/', download_report, name='download_report'),
    path('api/contact/', submit_contact, name='submit_contact')

   
]
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
