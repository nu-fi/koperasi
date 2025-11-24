from django.urls import path
from . import views

urlpatterns = [
    path('api/list/', views.get_loans, name='get_loans'),
]