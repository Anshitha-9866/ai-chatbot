from .views import chatbot_controller
from django.urls import path

urlpatterns = [
    # todo routes
    path('talk/', chatbot_controller, name='chatbot-talk'),
]