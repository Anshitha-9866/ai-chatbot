from django.db import models


class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=[
            ("fir", "FIR"),
            ("bail", "Bail"),
            ("legal_aid", "Legal Aid"),
            ("case_status", "Case Status"),
            ("other", "Other"),
        ],
        default="other",
    )
    keywords = models.TextField(
        help_text="Comma-separated keywords, e.g. fir, first information report, police complaint"
    )

    def keyword_list(self):
        return [k.strip().lower() for k in self.keywords.split(",") if k.strip()]

    def __str__(self):
        return self.question


class ChatMessage(models.Model):
    session_id = models.CharField(max_length=100)
    user_text = models.TextField()
    bot_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.session_id} - {self.created_at}"
