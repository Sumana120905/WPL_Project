from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/simulate/", views.simulate_api, name="simulate_api"),
]