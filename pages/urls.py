from django.urls import path
from .views import HomePageView,generate,process_client_data

urlpatterns = [
    path("", HomePageView.as_view(), name="home"),
    path("ok/", generate, name="generate"),
    path('process-client-data/', process_client_data, name='process_client_data'),

]
 