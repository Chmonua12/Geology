import json
import os
import urllib.error
import urllib.request

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST


ALLOWED_TOPICS = (
    "геолог",
    "опас",
    "адыге",
    "лаго",
    "наки",
    "дожд",
    "осад",
    "эроз",
    "промоин",
    "склон",
    "ополз",
    "сель",
    "обвал",
    "осып",
    "фишт",
    "хаджох",
    "каньон",
    "скал",
    "трещинов",
    "монитор",
    "наблюден",
    "осмотр",
    "маршрут",
    "сетк",
    "стен",
    "транше",
    "полк",
    "защит",
    "сооруж",
    "блок",
    "облом",
    "площадк",
    "размы",
    "руч",
    "тропа",
    "валун",
    "цвет",
    "указател",
    "задани",
    "локац",
    "риск",
    "процесс",
    "безопас",
)

OUT_OF_SCOPE_REPLY = (
    "Я специализируюсь только на вопросах геологической безопасности "
    "и опасных геологических процессов Республики Адыгея."
)


@ensure_csrf_cookie
def index(request):
    return render(request, "expedition/index.html")


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

    if not is_allowed_topic(question, context):
        return JsonResponse({"answer": OUT_OF_SCOPE_REPLY})

    answer = ask_polza_ai(question, context)
    if not answer:
        return JsonResponse(
            {
                "error": (
                    "Не удалось получить ответ от нейросети"
                )
            },
            status=502,
        )

    return JsonResponse({"answer": answer})


def is_allowed_topic(question, context=None):
    normalized = " ".join(
        [
            question,
            str((context or {}).get("location", "")),
            str((context or {}).get("topic", "")),
        ]
    ).casefold()
    topic_words = ALLOWED_TOPICS + (
        "каменномост",
        "ополз",
        "дерев",
        "трещ",
        "грунт",
        "осып",
        "дорог",
        "покрыт",
        "деформац",
        "дом",
        "столб",
        "знак",
        "кустар",
        "рельеф",
        "смещ",
        "чрезвычай",
        "ландшафт",
        "инженер",
        "прогноз",
        "улавлива",
        "покров",
        "паден",
        "поднож",
    )
    return any(topic in normalized for topic in topic_words)


def ask_polza_ai(question, context=None):
    api_key = get_polza_api_key()
    if not api_key:
        return None
    context = context or {}
    location = str(context.get("location") or "Лаго-Наки")
    topic = str(context.get("topic") or "геологическая безопасность")

    body = {
        "model": "sber/gigachat-plus",
        "messages": [
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
        ],
    }

    request = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            data = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return None

    try:
        return clean_model_answer(data["choices"][0]["message"]["content"].strip())
    except (KeyError, IndexError, TypeError):
        return None


def clean_model_answer(answer):
    if OUT_OF_SCOPE_REPLY not in answer:
        return strip_markdown_markers(answer)

    cleaned = answer.replace(OUT_OF_SCOPE_REPLY, "").strip()
    cleaned = cleaned.strip(" .\n")
    return strip_markdown_markers(cleaned) or OUT_OF_SCOPE_REPLY


def strip_markdown_markers(answer):
    return answer.replace("*", "").strip()


def get_polza_api_key():
    env_key = os.environ.get("POLZA_AI_API_KEY", "").strip()
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
        if key.strip() == "POLZA_AI_API_KEY":
            api_key = value.strip().strip('"').strip("'")
            if api_key == "вставьте_ваш_api_ключ_сюда":
                return ""
            return api_key

    return ""
