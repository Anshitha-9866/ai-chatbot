from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_home, name='chat_home'),        # Welcome message
    path('send/', views.send_message, name='send_message'),  # Send a chat message
    path('history/', views.chat_history, name='chat_history'), # Chat history
]
