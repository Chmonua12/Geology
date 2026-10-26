import json
import os
from unittest.mock import patch

from django.test import TestCase, override_settings
from django.urls import reverse

from .views import get_polza_api_key


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

    def test_polza_key_supports_current_environment_name(self):
        with patch.dict(os.environ, {"POLZA_API_KEY": "test-key"}, clear=True):
            self.assertEqual(get_polza_api_key(), "test-key")

    @patch("expedition.views.get_polza_api_key", return_value="test-key")
    @patch("expedition.views.ask_polza_ai", return_value=None)
    def test_chat_returns_error_instead_of_local_answer(self, _ask_ai, _get_key):
        response = self.client.post(
            reverse("geogid_chat"),
            data=json.dumps({"message": "Почему оползень опасен?"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 502)
        self.assertNotIn("answer", response.json())

    @patch("expedition.views.get_polza_api_key", return_value="test-key")
    @patch("expedition.views.ask_polza_ai", return_value="Ответ нейросети")
    def test_chat_returns_only_ai_answer(self, _ask_ai, _get_key):
        response = self.client.post(
            reverse("geogid_chat"),
            data=json.dumps({"message": "Почему оползень опасен?"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"answer": "Ответ нейросети", "mode": "ai"})
