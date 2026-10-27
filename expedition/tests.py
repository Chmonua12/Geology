import json
import os
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import ExperienceFeedback
from .views import get_polza_api_key


@override_settings(STATICFILES_STORAGE="django.contrib.staticfiles.storage.StaticFilesStorage")
class ExpeditionViewTests(TestCase):
    def test_index_contains_learning_entry_and_feedback(self):
        user = get_user_model().objects.create_user("Мила", password="secret12")
        self.client.force_login(user)
        response = self.client.get(reverse("index"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Начать экспедицию")
        self.assertContains(response, "Мой результат")
        self.assertContains(response, "Насколько понятным был маршрут?")
        self.assertContains(response, "Персональный разбор экспедиции")
        self.assertContains(response, "ID:")
        self.assertNotContains(response, "Итоги прохождения · MCP + Polza AI")
        self.assertNotContains(response, "Заполнено MCP")
        self.assertContains(response, "Пройти ещё раз")
        self.assertContains(response, "Выйти")
        self.assertContains(response, "data-learner-id=\"student-")

    def test_anonymous_index_shows_short_auth_form(self):
        response = self.client.get(reverse("index"))

        self.assertContains(response, '<section class="auth-gate"', html=False)
        self.assertContains(response, "Регистрация")
        self.assertNotContains(response, "expedition/app.js")

    def test_registration_hashes_password_and_assigns_distinct_ids(self):
        first = self.client.post(
            reverse("register_account"),
            data=json.dumps({"name": "Алина", "password": "secret12"}),
            content_type="application/json",
        )
        first_id = first.json()["learnerId"]
        self.client.post(reverse("logout_account"))
        second = self.client.post(
            reverse("register_account"),
            data=json.dumps({"name": "Борис", "password": "secret34"}),
            content_type="application/json",
        )

        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 201)
        self.assertNotEqual(first_id, second.json()["learnerId"])
        self.assertTrue(get_user_model().objects.get(username="Алина").check_password("secret12"))

    def test_login_and_logout(self):
        get_user_model().objects.create_user("Ученик", password="secret12")
        wrong = self.client.post(
            reverse("login_account"),
            data=json.dumps({"name": "Ученик", "password": "wrong12"}),
            content_type="application/json",
        )
        correct = self.client.post(
            reverse("login_account"),
            data=json.dumps({"name": "ученик", "password": "secret12"}),
            content_type="application/json",
        )
        logged_out = self.client.post(reverse("logout_account"))

        self.assertEqual(wrong.status_code, 401)
        self.assertEqual(correct.status_code, 200)
        self.assertTrue(correct.json()["learnerId"].startswith("student-"))
        self.assertEqual(logged_out.status_code, 200)
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_feedback_is_saved_and_updated_for_account(self):
        user = get_user_model().objects.create_user("Ученик", password="secret12")
        self.client.force_login(user)
        first = self.client.post(
            reverse("experience_feedback"),
            data=json.dumps({
                "rating": 4,
                "comment": "Добавить больше подсказок",
                "metrics": {
                    "completedStages": 4,
                    "durationMinutes": 9,
                    "errors": 2,
                    "hints": 1,
                },
            }),
            content_type="application/json",
        )
        second = self.client.post(
            reverse("experience_feedback"),
            data=json.dumps({"rating": 5, "comment": "Всё понятно"}),
            content_type="application/json",
        )
        restored = self.client.get(reverse("experience_feedback"))

        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(ExperienceFeedback.objects.count(), 1)
        self.assertEqual(restored.json()["feedback"]["rating"], 5)
        self.assertEqual(restored.json()["feedback"]["comment"], "Всё понятно")
        self.assertTrue(restored.json()["feedback"]["learnerId"].startswith("student-"))

    def test_feedback_requires_account(self):
        response = self.client.post(
            reverse("experience_feedback"),
            data=json.dumps({"rating": 5, "comment": "Хорошо"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)

    @override_settings(
        GEOLOGY_API_URL="https://mcp.example.test",
        GEOLOGY_FORM_URL="https://mcp.example.test",
    )
    def test_index_exposes_remote_mcp_service_urls(self):
        user = get_user_model().objects.create_user("Мила", password="secret12")
        self.client.force_login(user)
        response = self.client.get(reverse("index"))

        self.assertContains(response, 'data-api-url="https://mcp.example.test"')
        self.assertContains(response, 'data-form-url="https://mcp.example.test"')

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
