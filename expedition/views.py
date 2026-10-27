import json
import logging
import os

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from django.utils.crypto import salted_hmac
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST


OUT_OF_SCOPE_REPLY = (
    "Я специализируюсь только на вопросах геологической безопасности "
    "и опасных геологических процессов Республики Адыгея."
)
logger = logging.getLogger(__name__)


def learner_id_for_user(user):
    digest = salted_hmac(
        "expedition.learner-id",
        f"{user.pk}:{user.username}",
    ).hexdigest()[:12]
    return f"student-{digest}"


@ensure_csrf_cookie
def index(request):
    return render(
        request,
        "expedition/index.html",
        {
            "geology_api_url": settings.GEOLOGY_API_URL,
            "geology_form_url": settings.GEOLOGY_FORM_URL,
            "learner_id": (
                learner_id_for_user(request.user)
                if request.user.is_authenticated
                else ""
            ),
        },
    )


def _read_auth_payload(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None, JsonResponse({"error": "Некорректные данные."}, status=400)

    name = " ".join(str(payload.get("name", "")).split())
    password = str(payload.get("password", ""))
    if not 2 <= len(name) <= 40:
        return None, JsonResponse({"error": "Введите имя."}, status=400)
    if not 6 <= len(password) <= 128:
        return None, JsonResponse({"error": "Пароль должен содержать минимум 6 символов."}, status=400)
    return (name, password), None


def _find_user_by_name(name):
    folded_name = name.casefold()
    return next(
        (
            user
            for user in get_user_model().objects.only("username")
            if user.username.casefold() == folded_name
        ),
        None,
    )


@require_POST
def register_account(request):
    credentials, error_response = _read_auth_payload(request)
    if error_response:
        return error_response
    name, password = credentials
    User = get_user_model()
    if _find_user_by_name(name):
        return JsonResponse({"error": "Это имя уже занято."}, status=409)

    try:
        user = User.objects.create(
            username=name,
            password=make_password(password),
        )
    except IntegrityError:
        return JsonResponse({"error": "Это имя уже занято."}, status=409)

    login(request, user)
    return JsonResponse(
        {"ok": True, "learnerId": learner_id_for_user(user)},
        status=201,
    )


@require_POST
def login_account(request):
    credentials, error_response = _read_auth_payload(request)
    if error_response:
        return error_response
    name, password = credentials
    existing = _find_user_by_name(name)
    user = authenticate(
        request,
        username=existing.username if existing else name,
        password=password,
    )
    if user is None:
        return JsonResponse({"error": "Неверное имя или пароль."}, status=401)

    login(request, user)
    return JsonResponse({"ok": True, "learnerId": learner_id_for_user(user)})


@require_POST
def logout_account(request):
    logout(request)
    return JsonResponse({"ok": True})


@require_POST
def geogid_chat(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Некорректный JSON."}, status=400)

    question = str(payload.get("message", "")).strip()
    context = payload.get("context") if isinstance(payload.get("context"), dict) else {}
    if not question:
        return JsonResponse({"error": "Напишите вопрос для GeoChat."}, status=400)

    if not get_polza_api_key():
        return JsonResponse(
            {"error": "Не задан POLZA_API_KEY в файле .env."},
            status=503,
        )

    answer = ask_polza_ai(question, context)
    if not answer:
        return JsonResponse(
            {
                "error": (
                    "GeoChat не смог связаться с Polza AI. "
                    "Проверьте подключение к интернету и попробуйте ещё раз."
                )
            },
            status=502,
        )

    return JsonResponse({"answer": answer, "mode": "ai"})


def ask_polza_ai(question, context=None):
    api_key = get_polza_api_key()
    if not api_key:
        return None
    context = context or {}
    location = str(context.get("location") or "Лаго-Наки")
    topic = str(context.get("topic") or "геологическая безопасность")

    messages = [
            {
                "role": "system",
                "content": (
                    "Ты GeoChat, помощник проекта «Монолит». "
                    f"Контекст: локация {location}, тема — {topic}. "
                    "Отвечай по-русски, кратко, дружелюбно и только о геологической "
                    "безопасности, опасных геологических процессах, Республике Адыгея, "
                    "оползнях, обвалах, осыпях, эрозии, мониторинге склонов, "
                    "инженерной защите, текущей локации и текущем задании. "
                    "Не используй Markdown, звездочки, жирное выделение и списки со звездочками. "
                    "Не используй фразу отказа в ответах по геологии, оползням, "
                    "обвалам, склонам, трещинам, осыпям, осадкам, дорогам, "
                    "защитным сеткам, траншеям и признакам опасности. "
                    "Если вопрос явно не относится к этим темам, верни строго эту фразу: "
                    f"{OUT_OF_SCOPE_REPLY}"
                ),
            },
            {"role": "user", "content": question},
        ]

    try:
        from openai import OpenAI

        client = OpenAI(
            api_key=api_key,
            base_url="https://polza.ai/api/v1",
            timeout=25,
            max_retries=1,
        )
        completion = client.chat.completions.create(
            model="sber/gigachat-max",
            messages=messages,
            temperature=0.3,
            max_tokens=500,
        )
        answer = completion.choices[0].message.content if completion.choices else ""
    except Exception as error:
        logger.warning("Polza AI request failed: %s", error)
        return None

    return clean_model_answer(str(answer or "").strip()) or None


def clean_model_answer(answer):
    if OUT_OF_SCOPE_REPLY not in answer:
        return strip_markdown_markers(answer)

    cleaned = answer.replace(OUT_OF_SCOPE_REPLY, "").strip()
    cleaned = cleaned.strip(" .\n")
    return strip_markdown_markers(cleaned) or OUT_OF_SCOPE_REPLY


def strip_markdown_markers(answer):
    return answer.replace("*", "").strip()


def get_polza_api_key():
    env_key = (
        os.environ.get("POLZA_API_KEY", "").strip()
        or os.environ.get("POLZA_AI_API_KEY", "").strip()
    )
    if env_key:
        return env_key

    env_path = settings.BASE_DIR / ".env"
    if not env_path.exists():
        return ""

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        if key.strip() in {"POLZA_API_KEY", "POLZA_AI_API_KEY"}:
            api_key = value.strip().strip('"').strip("'")
            if api_key.casefold() in {
                "вставьте_ваш_api_ключ_сюда",
                "your_polza_api_key_here",
            }:
                return ""
            return api_key

    return ""
