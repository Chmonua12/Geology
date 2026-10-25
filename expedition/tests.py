import json

from django.test import TestCase, override_settings
from django.urls import reverse

from .views import OUT_OF_SCOPE_REPLY, is_allowed_topic


@override_settings(STATICFILES_STORAGE="django.contrib.staticfiles.storage.StaticFilesStorage")
class ExpeditionViewTests(TestCase):
    def test_index_contains_learning_entry_and_feedback(self):
        response = self.client.get(reverse("index"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Начать экспедицию")
        self.assertContains(response, "Мой результат")
        self.assertContains(response, "Насколько понятным был маршрут?")
        self.assertContains(response, "Пройти ещё раз")

    def test_chat_rejects_empty_question(self):
        response = self.client.post(
            reverse("geogid_chat"),
            data=json.dumps({"message": ""}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)

    def test_chat_keeps_unrelated_questions_out_of_scope(self):
        response = self.client.post(
            reverse("geogid_chat"),
            data=json.dumps({"message": "Как приготовить пирог?"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["answer"], OUT_OF_SCOPE_REPLY)

    def test_geology_questions_are_allowed(self):
        self.assertTrue(is_allowed_topic("Почему оползень опасен после дождя?"))
        self.assertFalse(is_allowed_topic("Какая сегодня футбольная игра?"))
