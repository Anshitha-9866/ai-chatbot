from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.crypto import get_random_string
from .models import FAQ, ChatMessage
import json

FALLBACK_REPLY = (
    "I am not sure how to answer that. "
    "Please try to rephrase your question in simple words "
    "(for example: 'How to file an FIR?') or contact official support."
)


def normalize(text: str) -> str:
    return text.lower().strip()


def score_faq(message: str, faq: FAQ) -> float:
    msg = normalize(message)
    hits = 0
    kws = faq.keyword_list()
    for kw in kws:
        if kw and kw in msg:
            hits += 1
    if not kws:
        return 0.0
    return hits / len(kws)


def get_best_faq(message: str):
    faqs = FAQ.objects.all()
    best = None
    best_score = 0.0
    for faq in faqs:
        s = score_faq(message, faq)
        if s > best_score:
            best_score = s
            best = faq
    return best, best_score


@csrf_exempt
def chat_home(request):
    # GET /api/chat/
    return JsonResponse({"message": "Legal AI Chatbot Backend is running"})


@csrf_exempt
def send_message(request):
    # POST /api/chat/send/
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body or "{}")
        user_message = (data.get("message") or "").strip()
        session_id = data.get("sessionId") or get_random_string(16)

        if not user_message:
            return JsonResponse({"error": "Message is required"}, status=400)

        # greeting intent
        if any(w in normalize(user_message) for w in ["hi", "hello", "hey"]):
            bot_response = (
                "Hello, I am the Legal AI Chatbot. "
                "You can ask about FIR, bail, legal aid, or case status."
            )
            faq_intent = "greeting"
        else:
            # FAQ-based matching
            best_faq, score = get_best_faq(user_message)
            if best_faq and score >= 0.3:
                bot_response = best_faq.answer
                faq_intent = best_faq.category
            else:
                bot_response = FALLBACK_REPLY
                faq_intent = "fallback"

        # store in DB
        ChatMessage.objects.create(
            session_id=session_id,
            user_text=user_message,
            bot_text=bot_response,
        )

        # last N messages for this session
        last_msgs = (
            ChatMessage.objects.filter(session_id=session_id)
            .order_by("-created_at")[:10]
        )
        history = [
            {"user": m.user_text, "bot": m.bot_text}
            for m in reversed(last_msgs)
        ]

        return JsonResponse(
            {
                "sessionId": session_id,
                "user": user_message,
                "bot": bot_response,
                "intent": faq_intent,
                "history": history,
            }
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
