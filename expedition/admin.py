from django.contrib import admin

from .models import ExperienceFeedback


@admin.register(ExperienceFeedback)
class ExperienceFeedbackAdmin(admin.ModelAdmin):
    list_display = ("user", "learner_id", "rating", "updated_at")
    list_filter = ("rating", "updated_at")
    search_fields = ("user__username", "learner_id", "comment")
    readonly_fields = ("user", "learner_id", "created_at", "updated_at")
