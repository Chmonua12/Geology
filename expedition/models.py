from django.conf import settings
from django.db import models


class ExperienceFeedback(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="experience_feedback",
    )
    learner_id = models.CharField(max_length=80, db_index=True)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    metrics = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at",)
        verbose_name = "отзыв о маршруте"
        verbose_name_plural = "отзывы о маршруте"

    def __str__(self):
        return f"{self.user.username}: {self.rating}/5"
