from django.urls import path
from . import views

urlpatterns = [
    path("", views.chat_home, name="chat_home"),         # GET /api/chat/
    path("send/", views.send_message, name="send_message"),  # POST /api/chat/send/
]
