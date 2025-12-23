from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# In-memory chat history (reset on server restart)
chat_history_data = []

def chat_home(request):
    return JsonResponse({
        "message": "Welcome to the Chat API! Use /api/chat/send/ to send messages."
    })

@csrf_exempt  # Allows POST from Postman / curl without CSRF token
def send_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            
            # Simple bot response
            bot_response = f"Bot: You said '{user_message}'"
            
            # Save to chat history
            chat_history_data.append({"user": user_message, "
