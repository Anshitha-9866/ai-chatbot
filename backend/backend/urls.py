from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Root endpoint
def root_view(request):
    return JsonResponse({"message": "Welcome to the Chat API! Visit /api/chat/ to interact."})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', root_view),              # Root URL
    path('api/chat/', include('chat.urls')),  # Chat API
]
