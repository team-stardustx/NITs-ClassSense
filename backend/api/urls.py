# backend/api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.get_status, name='get_status'),
    path('logs/', views.get_alert_logs, name='get_alert_logs'), # <-- ADD THIS LINE
]