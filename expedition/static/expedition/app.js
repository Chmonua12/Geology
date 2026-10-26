const OUT_OF_SCOPE_REPLY = "Я специализируюсь только на вопросах геологической безопасности и опасных геологических процессов Республики Адыгея.";

const SCREEN_CONFIG = {
    "Лаго-Наки": {
        guideIntro: "На этой локации смотрим на карстовую опасность: растворимый известняк, движение воды и видимые карстовые формы рельефа. Отмечайте именно факторы, которые помогают понять, где поверхность может быть неустойчивой.",
        correctFeedback: "Это важный фактор карстовой опасности на Лаго-Наки.",
        wrongFeedback: "Этот объект сам по себе не является причиной карстовых процессов.",
        quickQuestions: [
            "Почему известняк растворяется водой?",
            "Что такое карст?",
            "Как образуются карстовые воронки?",
            "Чем опасны карстовые процессы на Лаго-Наки?",
        ],
        summary(found, wrong) {
            return [
                "Разбор прохождения:",
                `Найдены факторы карстовой опасности: ${found.join(", ")}.`,
                "Пропущенные признаки: нет.",
                wrong.length
                    ? `Ошибочные варианты: ${wrong.join(", ")}. Они могут быть частью пейзажа или инфраструктуры, но не являются прямыми факторами развития карста.`
                    : "Ошибочных выборов не было.",
                "Главный вывод: карстовая опасность возникает там, где растворимые породы, вода и уже заметные формы рельефа работают вместе.",
            ].join("\n");
        },
    },
    "Каменномостский": {
        guideIntro: "Здесь задача про ранние признаки оползня. Ищите изменения, которые показывают движение грунта: воду из склона, наклон деревьев и трещины у подошвы.",
        correctFeedback: "Этот признак может свидетельствовать о смещении грунта и развитии оползня.",
        wrongFeedback: "Этот объект сам по себе не является признаком оползневого процесса.",
        quickQuestions: [
            "Почему деревья наклоняются перед оползнем?",
            "Откуда появляются трещины на склоне?",
            "Можно ли остановить оползень?",
            "Какие оползни встречаются в Адыгее?",
        ],
        summary(found, wrong) {
            return [
                "Разбор прохождения:",
                `Найдены признаки возможного оползня: ${found.join(", ")}.`,
                "Пропущенные признаки: нет.",
                wrong.length
                    ? `Ошибочные варианты: ${wrong.join(", ")}. Эти объекты важны для ориентирования, но сами по себе не доказывают развитие оползня.`
                    : "Ошибочных выборов не было.",
                "Главный вывод: геологическая безопасность начинается с раннего обнаружения трещин, смещения грунта, осыпей и деформаций дороги.",
            ].join("\n");
        },
    },
    "Фишт и Хаджох": {
        guideIntro: "На этой локации вы принимаете инженерное решение для опасных зон. Для каждой зоны нужно выбрать, что наблюдать, и какую защиту поставить от обвалов и осыпей.",
        correctFeedback: "Решение выбрано верно: для опасной зоны важно заранее наблюдать склон и подобрать защиту под тип угрозы.",
        wrongFeedback: "Этот вариант относится к природной безопасности, но не подходит именно для обвально-осыпной зоны.",
        quickQuestions: [
            "Чем обвал отличается от осыпи?",
            "Зачем нужны улавливающие сетки?",
            "Как наблюдают опасные скальные склоны?",
            "Какие обвально-осыпные процессы встречаются в Адыгее?",
        ],
        summary(found, wrong) {
            return [
                "Разбор инженерного решения:",
                `Проверенные зоны: ${found.join(", ")}.`,
                wrong.length
                    ? `Ошибочные варианты: ${wrong.join(", ")}. Они могут быть полезны в других задачах, но не решают риск падения обломков здесь.`
                    : "Ошибочных выборов не было.",
                "Главный вывод: геологическая безопасность начинается не после обвала, а до него — с наблюдения, прогноза и понятных мер защиты.",
            ].join("\n");
        },
    },
    "Инженерная защита": {
        guideIntro: "Помогите коту Вжуху собрать решения инженерной защиты. Каждое фото показывает способ сделать дорогу или склон безопаснее: водоотвод, дренаж, габионы, сетки и лесопосадки.",
        correctFeedback: "Блок укрепления собран. Такие решения помогают снизить риск для людей и инфраструктуры.",
        wrongFeedback: "Этот объект не относится к сбору укреплений.",
        quickQuestions: [
            "Зачем нужны улавливающие сетки?",
            "Как работает подпорная стена?",
            "Когда используют улавливающую траншею?",
            "Какие инженерные защиты применяют в горах Адыгеи?",
        ],
        summary(found, wrong) {
            return [
                "Разбор мини-игры:",
                `Собранные укрепления: ${found.join(", ")}.`,
                wrong.length
                    ? `Ошибочные столкновения: ${wrong.join(", ")}. В игре важны именно фотоблоки после препятствий.`
                    : "Все фотоблоки собраны без лишних ошибок.",
                "Главный вывод: инженерная защита помогает не ждать чрезвычайной ситуации, а заранее уменьшать риск у опасных склонов.",
            ].join("\n");
        },
    },
    "Сертификат": {
        guideIntro: "Впишите имя участника, чтобы оформить сертификат юного специалиста Монолита. Это награда за прохождение мини-обучения по геологической безопасности.",
        quickQuestions: [
            "Что я изучил в мини-курсе?",
            "Какие признаки опасности важно запомнить?",
            "Зачем нужен мониторинг склонов?",
            "Как объяснить геологическую безопасность простыми словами?",
        ],
        summary(found, wrong) {
            return [
                "Вы прошли мини-обучение по геологической безопасности.",
                "Теперь вы умеете замечать ранние признаки опасных процессов и выбирать меры защиты.",
            ].join("\n");
        },
    },
};

const DECISION_ZONES = {
    "fisht-rock": {
        zoneLabel: "Зона A",
        label: "Зона A: Фишт, верхний скальный пояс",
        title: "Фишт, верхний скальный пояс",
        shortLabel: "Фишт, верхний скальный пояс",
        icon: "△",
        description: "Трещиноватый крутой участок расположен над тропой. Нужно решить, как его наблюдать и чем защитить людей внизу.",
        observeCorrect: "Маршрутный визуальный осмотр склона",
        protectCorrect: "Улавливающие сетки/стены у подножья",
        observeOptions: [
            "Маршрутный визуальный осмотр склона",
            "Наблюдение за уровнем паводка",
            "Контроль качества питьевой воды",
        ],
        protectOptions: [
            "Улавливающие сетки/стены у подножья",
            "Берегоукрепительный мол",
            "Противофильтрационный экран",
        ],
        reason: "Для крутого трещиноватого склона важны маршрутные обследования и сооружения, которые перехватывают падающие обломки у подножья.",
    },
    "fisht-scree": {
        zoneLabel: "Зона B",
        label: "Зона B: Фишт, шлейф осыпи над проходом",
        title: "Фишт, шлейф осыпи над проходом",
        shortLabel: "Фишт, шлейф осыпи",
        icon: "⌁",
        description: "Конус осыпи расположен выше прохода. Здесь важно не только заметить свежий материал, но и выбрать защиту у подошвы склона.",
        observeCorrect: "Долговременное наблюдение на ответственном участке",
        protectCorrect: "Улавливающая траншея/полка",
        observeOptions: [
            "Долговременное наблюдение на ответственном участке",
            "Подсчёт туристов на маршруте",
            "Измерение прозрачности ручья",
        ],
        protectOptions: [
            "Улавливающая траншея/полка",
            "Ливневая канализация в посёлке",
            "Снегозадерживающий щит",
        ],
        reason: "На ответственном участке нужна длительная фиксация изменений, а траншея или полка помогает задержать осыпной материал до прохода.",
    },
    "hadzhokh-edge": {
        zoneLabel: "Зона C",
        label: "Зона C: Хаджох, нависающий борт над площадкой",
        title: "Хаджох, нависающий борт над площадкой",
        shortLabel: "Хаджох, нависающий борт",
        icon: "◒",
        description: "Узкий борт каньона нависает рядом с площадкой. Решение должно учитывать опасные блоки прямо над местом пребывания людей.",
        observeCorrect: "Осмотр нависающего борта и опасных блоков",
        protectCorrect: "Свободно висящая покровная сетка",
        observeOptions: [
            "Осмотр нависающего борта и опасных блоков",
            "Наблюдение за уровнем паводка",
            "Проверка влажности почвы на лугу",
        ],
        protectOptions: [
            "Свободно висящая покровная сетка",
            "Берегоукрепительный мол",
            "Противофильтрационный экран",
        ],
        reason: "У туристической площадки важно выявить опасные блоки и закрыть склон покровной сеткой, чтобы камни не падали на людей.",
    },
};

const FLAPPY_ITEMS = [
    {
        id: "drainage-ditch",
        title: "Нагорная канава (водоотвод)",
        photo: "/static/images/photo1.png",
        background: "/static/images/fon1.png",
        description: "Нагорная канава отводит поверхностную воду от опасного склона. Это снижает размыв грунта и уменьшает вероятность ослабления склоновых пород после дождей.",
    },
    {
        id: "drainage",
        title: "Дренаж",
        photo: "/static/images/photo2.png",
        background: "/static/images/fon2.png",
        description: "Дренаж выводит лишнюю воду из грунта. Когда склон меньше переувлажняется, снижается риск смещения пород и образования оползневых деформаций.",
    },
    {
        id: "gabions",
        title: "Габионы",
        photo: "/static/images/photo3.png",
        background: "/static/images/fon3.png",
        description: "Габионы укрепляют основание склона и береговые участки. Каменные блоки в сетчатых конструкциях помогают удерживать грунт и пропускают воду.",
    },
    {
        id: "rockfall-net",
        title: "Защитная сетка от камнепадов",
        photo: "/static/images/photo4.png",
        background: "/static/images/fon4.png",
        description: "Защитная сетка удерживает или направляет падающие камни, чтобы они не попадали на дорогу, тропу или площадку с людьми.",
    },
    {
        id: "forest-planting",
        title: "Лесопосадки",
        photo: "/static/images/photo5.png",
        background: "/static/images/fon5.png",
        description: "Лесопосадки укрепляют верхний слой грунта корнями, уменьшают поверхностный сток и помогают стабилизировать склон на ранних стадиях разрушения.",
    },
];

const APP_STORAGE_VERSION = "ux-practicum-v2";
const APP_STORAGE_VERSION_KEY = "geoshield-storage-version";
const ACTIVE_SCREEN_KEY = "geoshield-active-screen-index";
const METRICS_KEY = "geoshield-learning-metrics-v1";
const LEARNER_ID_KEY = "geoshield-learner-id";
const PERSONALIZATION_API_URL = "http://127.0.0.1:3001";
const COMPLETION_KEYS = [
    "geoshield-lago-complete",
    "geoshield-kamennomostsky-complete",
    "geoshield-fisht-hadzhokh-complete",
    "geoshield-protection-flight-complete",
];

function shuffleOptions(options) {
    const shuffled = [...options];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

resetProgressIfNeeded();
const journeyMetrics = loadMetrics();
const learnerId = getOrCreateLearnerId();

const screens = [...document.querySelectorAll(".expedition-screen")];
const track = document.querySelector("#expedition-track");
const screenState = new WeakMap();
let currentScreenIndex = getInitialScreenIndex();
let activeScreen = screens[currentScreenIndex] || screens[0];
let isRouteTransitioning = false;

const guidePanel = document.querySelector("#guide-panel");
const guideBackdrop = document.querySelector("#guide-backdrop");
const guideOpen = document.querySelector("#guide-open");
const guideClose = document.querySelector("#guide-close");
const guideForm = document.querySelector("#guide-form");
const guideInput = document.querySelector("#guide-input");
const guideChat = document.querySelector("#guide-chat");
const guideIntro = document.querySelector("#guide-intro");
const quickQuestions = document.querySelector("#quick-questions");
const quickQuestionList = document.querySelector(".quick-question-list");
const decisionModal = document.querySelector("#decision-modal");
const decisionZoneLabel = document.querySelector("#decision-zone-label");
const decisionTitle = document.querySelector("#decision-title");
const decisionDescription = document.querySelector("#decision-description");
const decisionHint = document.querySelector("#decision-hint");
const decisionClose = document.querySelector("[data-decision-close]");
const decisionOptionGroups = document.querySelectorAll("[data-options]");
const reinforcementModal = document.querySelector("#reinforcement-modal");
const reinforcementClose = document.querySelector("#reinforcement-close");
const reinforcementImage = document.querySelector("#reinforcement-image");
const reinforcementTitle = document.querySelector("#reinforcement-title");
const reinforcementDescription = document.querySelector("#reinforcement-description");
const certificateNameInput = document.querySelector("#certificate-name-input");
const certificateNameOutput = document.querySelector("#certificate-name-output");
const onboarding = document.querySelector("#onboarding");
const onboardingProgress = document.querySelector("#onboarding-progress");
const startExpeditionButton = document.querySelector("#start-expedition");
const resumeExpeditionButton = document.querySelector("#resume-expedition");
const experienceForm = document.querySelector("#experience-form");
const experienceComment = document.querySelector("#experience-comment");
const experienceStatus = document.querySelector("#experience-status");
const restartExpeditionButton = document.querySelector("#restart-expedition");
const personalExpeditionLink = document.querySelector("#personal-expedition-link");
const feedbackTypingTimers = new WeakMap();
const feedbackHideTimers = new WeakMap();
let activeDecision = null;
let activeFlappyScreen = null;
let activeFlappyGroup = null;

screens.forEach((screen) => {
    const state = {
        foundSigns: new Set(),
        wrongAttempts: new Set(),
        completionShown: false,
        completed: localStorage.getItem(screen.dataset.storageKey) === "true",
    };

    screenState.set(screen, state);
    setupScreen(screen, state);
});

setTrackPosition(currentScreenIndex);

guideOpen.addEventListener("click", () => {
    recordMetric("hints");
    openGuide();
});
guideClose.addEventListener("click", closeGuide);
guideBackdrop.addEventListener("click", closeGuide);
decisionClose?.addEventListener("click", closeDecisionModal);
decisionModal?.addEventListener("click", (event) => {
    if (event.target === decisionModal) {
        closeDecisionModal();
    }
});
reinforcementClose?.addEventListener("click", closeReinforcementModal);
reinforcementModal?.addEventListener("click", (event) => {
    if (event.target === reinforcementModal) {
        closeReinforcementModal();
    }
});
setupGalleries();
setupRouteNavigation();
setupOnboarding();
restoreExperienceFeedback();
updateResultSummary();
if (personalExpeditionLink) {
    personalExpeditionLink.href = `http://127.0.0.1:5173/?learner=${encodeURIComponent(learnerId)}`;
}
syncLearningProgress();

certificateNameInput?.addEventListener("input", () => {
    const name = certificateNameInput.value.trim();
    certificateNameOutput.textContent = name || "Ваше имя";
});

document.querySelectorAll(".continue-button").forEach((button) => {
    button.addEventListener("click", () => {
        if (button.dataset.action === "screen3") {
            goToScreen3();
            return;
        }

        transitionTo(button.dataset.nextTarget || "#screen-kamennomostsky");
    });
});

guideForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = guideInput.value.trim();
    if (!question) {
        return;
    }

    guideInput.value = "";
    await sendGuideQuestion(question);
});

quickQuestionList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
        recordMetric("hints");
        openGuide();
        await sendGuideQuestion(button.textContent.trim());
    });
});

experienceForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const rating = Number(new FormData(experienceForm).get("rating"));
    if (!rating) {
        experienceStatus.textContent = "Выберите оценку от 1 до 5.";
        return;
    }

    journeyMetrics.rating = rating;
    journeyMetrics.comment = experienceComment.value.trim();
    journeyMetrics.feedbackSavedAt = new Date().toISOString();
    saveMetrics();
    experienceStatus.textContent = "Спасибо! Оценка сохранена в этом браузере.";
});

restartExpeditionButton?.addEventListener("click", () => {
    COMPLETION_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("geoshield-certificate-complete");
    localStorage.setItem(ACTIVE_SCREEN_KEY, "0");
    journeyMetrics.attempts += 1;
    journeyMetrics.startedAt = new Date().toISOString();
    journeyMetrics.completedAt = "";
    journeyMetrics.completedStages = [];
    journeyMetrics.correctActions = 0;
    journeyMetrics.errors = 0;
    journeyMetrics.hints = 0;
    journeyMetrics.flappyRestarts = 0;
    journeyMetrics.topicErrors = createEmptyTopicErrors();
    saveMetrics();
    window.location.reload();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !decisionModal?.hidden) {
        closeDecisionModal();
        return;
    }

    if (event.key === "Escape" && !reinforcementModal?.hidden) {
        closeReinforcementModal();
        return;
    }

    if (event.key === "Enter" || event.code === "NumpadEnter") {
        const isTypingTarget = event.target?.closest?.("input, textarea, button");
        const flappyScreen = document.querySelector("#screen-protection-flight");
        const state = screenState.get(flappyScreen);
        if (
            flappyScreen
            && !isTypingTarget
            && !guidePanel.classList.contains("is-open")
            && !state?.completed
            && reinforcementModal?.hidden !== false
        ) {
            event.preventDefault();
            activeScreen = flappyScreen;
            flap(flappyScreen);
            return;
        }
    }

    if (event.key === "Escape" && guidePanel.classList.contains("is-open")) {
        closeGuide();
    }
});

window.addEventListener("resize", () => {
    setTrackPosition(currentScreenIndex);
    screens.forEach((screen) => {
        const state = screenState.get(screen);
        if (screen.classList.contains("flappy-screen") && state?.flappy) {
            buildFlappyObjects(screen, state);
            resetFlappyBird(screen);
        }
    });
});

const observer = new IntersectionObserver(
    (entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target) {
            activeScreen = visible.target;
            updateQuickQuestions();
        }
    },
    { threshold: [0.35, 0.55, 0.75] },
);

screens.forEach((screen) => observer.observe(screen));
updateQuickQuestions();

function loadMetrics() {
    const defaults = {
        attempts: 0,
        startedAt: "",
        completedAt: "",
        completedStages: [],
        correctActions: 0,
        errors: 0,
        hints: 0,
        flappyRestarts: 0,
        rating: 0,
        comment: "",
        feedbackSavedAt: "",
        topicErrors: createEmptyTopicErrors(),
    };

    try {
        const stored = JSON.parse(localStorage.getItem(METRICS_KEY) || "{}");
        return { ...defaults, ...stored };
    } catch (error) {
        return defaults;
    }
}

function saveMetrics() {
    localStorage.setItem(METRICS_KEY, JSON.stringify(journeyMetrics));
    updateResultSummary();
    syncLearningProgress();
}

function recordMetric(name, amount = 1) {
    journeyMetrics[name] = Number(journeyMetrics[name] || 0) + amount;
    saveMetrics();
}

function createEmptyTopicErrors() {
    return { karst: 0, landslide: 0, rockfall: 0, protection: 0 };
}

function getOrCreateLearnerId() {
    const stored = localStorage.getItem(LEARNER_ID_KEY);
    if (stored) {
        return stored;
    }
    const id = `student-${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem(LEARNER_ID_KEY, id);
    return id;
}

function getTopicForScreen(screen) {
    if (screen?.id?.includes("lago")) return "karst";
    if (screen?.id?.includes("kamennomostsky")) return "landslide";
    if (screen?.id?.includes("protection")) return "protection";
    return "rockfall";
}

function recordTopicError(screen) {
    const topic = getTopicForScreen(screen);
    journeyMetrics.errors = Number(journeyMetrics.errors || 0) + 1;
    journeyMetrics.topicErrors = { ...createEmptyTopicErrors(), ...(journeyMetrics.topicErrors || {}) };
    journeyMetrics.topicErrors[topic] += 1;
    saveMetrics();
}

function syncLearningProgress() {
    const payload = {
        learnerId,
        completedStages: Math.max(getCompletedStageCount(), journeyMetrics.completedStages.length),
        errors: Math.min(999, Number(journeyMetrics.errors || 0)),
        hints: Math.min(999, Number(journeyMetrics.hints || 0)),
        durationMinutes: Math.min(999, getJourneyDurationMinutes()),
        topicErrors: { ...createEmptyTopicErrors(), ...(journeyMetrics.topicErrors || {}) },
    };

    fetch(`${PERSONALIZATION_API_URL}/api/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).catch(() => {
        // Основная экспедиция продолжает работать, даже если локальный MCP API не запущен.
    });
}

function setupOnboarding() {
    const completed = getCompletedStageCount();
    const hasProgress = completed > 0 || Number(localStorage.getItem(ACTIVE_SCREEN_KEY) || 0) > 0;
    onboardingProgress.textContent = hasProgress
        ? `Сохранён прогресс: ${completed} из ${COMPLETION_KEYS.length} учебных этапов.`
        : "Прогресс пока не начат.";
    resumeExpeditionButton.hidden = !hasProgress;
    startExpeditionButton.textContent = hasProgress ? "Начать заново" : "Начать экспедицию";

    startExpeditionButton.addEventListener("click", () => {
        if (hasProgress) {
            COMPLETION_KEYS.forEach((key) => localStorage.removeItem(key));
            localStorage.setItem(ACTIVE_SCREEN_KEY, "0");
            currentScreenIndex = 0;
            activeScreen = screens[0];
            journeyMetrics.completedStages = [];
            journeyMetrics.correctActions = 0;
            journeyMetrics.errors = 0;
            journeyMetrics.hints = 0;
            journeyMetrics.flappyRestarts = 0;
            journeyMetrics.topicErrors = createEmptyTopicErrors();
        }
        journeyMetrics.attempts += 1;
        journeyMetrics.startedAt = new Date().toISOString();
        journeyMetrics.completedAt = "";
        saveMetrics();
        onboarding.hidden = true;
        setTrackPosition(currentScreenIndex);
    });

    resumeExpeditionButton.addEventListener("click", () => {
        if (!journeyMetrics.startedAt) {
            journeyMetrics.startedAt = new Date().toISOString();
            saveMetrics();
        }
        onboarding.hidden = true;
        setTrackPosition(currentScreenIndex);
    });
}

function getCompletedStageCount() {
    return COMPLETION_KEYS.filter((key) => localStorage.getItem(key) === "true").length;
}

function markStageCompleted(storageKey) {
    if (!COMPLETION_KEYS.includes(storageKey) || journeyMetrics.completedStages.includes(storageKey)) {
        return;
    }
    journeyMetrics.completedStages.push(storageKey);
    if (journeyMetrics.completedStages.length === COMPLETION_KEYS.length) {
        journeyMetrics.completedAt = new Date().toISOString();
    }
    saveMetrics();
}

function updateResultSummary() {
    const stages = Math.max(getCompletedStageCount(), journeyMetrics.completedStages.length);
    const duration = getJourneyDurationMinutes();
    const stageNode = document.querySelector("#metric-stages");
    const errorNode = document.querySelector("#metric-errors");
    const hintsNode = document.querySelector("#metric-hints");
    const timeNode = document.querySelector("#metric-time");
    if (stageNode) stageNode.textContent = `${stages}/${COMPLETION_KEYS.length}`;
    if (errorNode) errorNode.textContent = String(journeyMetrics.errors);
    if (hintsNode) hintsNode.textContent = String(journeyMetrics.hints);
    if (timeNode) timeNode.textContent = duration ? `${duration} мин` : "—";
}

function getJourneyDurationMinutes() {
    if (!journeyMetrics.startedAt) {
        return 0;
    }
    const end = journeyMetrics.completedAt ? new Date(journeyMetrics.completedAt) : new Date();
    const start = new Date(journeyMetrics.startedAt);
    const minutes = Math.max(1, Math.round((end - start) / 60000));
    return Number.isFinite(minutes) ? minutes : 0;
}

function restoreExperienceFeedback() {
    if (!experienceForm) {
        return;
    }
    const ratingInput = experienceForm.querySelector(`input[name="rating"][value="${journeyMetrics.rating}"]`);
    if (ratingInput) {
        ratingInput.checked = true;
    }
    experienceComment.value = journeyMetrics.comment || "";
    if (journeyMetrics.feedbackSavedAt) {
        experienceStatus.textContent = "Ваша предыдущая оценка сохранена.";
    }
}

function setupScreen(screen, state) {
    const required = Number(screen.dataset.required);
    const countNode = screen.querySelector(".found-count");
    const signCounter = screen.querySelector(".sign-counter");
    const counterOrb = screen.querySelector(".counter-orb");

    if (countNode) {
        countNode.textContent = state.completed ? `${required}/${required}` : `0/${required}`;
    }
    signCounter?.classList.toggle("is-complete", state.completed);
    counterOrb?.classList.toggle("is-active", state.completed);

    if (state.completed) {
        screen.querySelector(".continue-button")?.classList.add("is-visible");
        setRouteState(screen, getCompletedRouteProgress(screen));
        setRoutePointState(screen, getCurrentStage(screen));
    }

    if (screen.classList.contains("decision-screen")) {
        setupDecisionScreen(screen, state);
        return;
    }

    if (screen.classList.contains("flappy-screen")) {
        setupFlappyScreen(screen, state);
        return;
    }

    screen.querySelectorAll(".hotspot-layer").forEach((layer) => {
        layer.addEventListener("click", (event) => {
            const hotspot = event.target.closest(".hotspot");
            if (hotspot && screen.contains(hotspot)) {
                handleHotspotClick(screen, hotspot);
            }
        });
    });

    screen.querySelectorAll(".hotspot").forEach((hotspot) => {
        hotspot.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleHotspotClick(screen, hotspot);
            }
        });
    });
}

function setupDecisionScreen(screen, state) {
    if (!state.zoneChoices) {
        state.zoneChoices = {};
    }

    screen.querySelectorAll(".decision-zone").forEach((zone) => {
        const zoneConfig = DECISION_ZONES[zone.dataset.zone];
        if (!zoneConfig) {
            return;
        }

        if (state.completed) {
            state.foundSigns.add(zoneConfig.shortLabel);
            zone.classList.add("is-verified");
        }

        zone.addEventListener("click", () => openDecisionModal(screen, zone));
        zone.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDecisionModal(screen, zone);
            }
        });
    });

    if (state.completed) {
        const required = Number(screen.dataset.required);
        const countNode = screen.querySelector(".found-count");
        if (countNode) {
            countNode.textContent = `${required}/${required}`;
        }
    }
}

function setupFlappyScreen(screen, state) {
    const game = screen.querySelector(".flappy-game");
    const objectsLayer = screen.querySelector(".flappy-objects");
    const bird = screen.querySelector(".flappy-bird");
    const restartButton = screen.querySelector(".flappy-restart");

    if (!game || !objectsLayer || !bird) {
        return;
    }

    state.completed = false;
    state.completionShown = false;
    state.foundSigns.clear();
    state.wrongAttempts.clear();
    localStorage.removeItem(screen.dataset.storageKey);

    state.flappy = {
        bird,
        game,
        objectsLayer,
        birdY: 0,
        velocity: 0,
        started: false,
        paused: state.completed,
        raf: 0,
        lastTime: 0,
        gameOver: false,
        groups: [],
    };

    buildFlappyObjects(screen, state);
    resetFlappyBird(screen);

    game.addEventListener("click", () => {
        if (state.flappy.gameOver) {
            return;
        }
        activeScreen = screen;
        game.focus({ preventScroll: true });
        flap(screen);
    });

    restartButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        restartFlappyGame(screen);
    });
}

function buildFlappyObjects(screen, state) {
    const gameWidth = Math.max(900, state.flappy.game.clientWidth || window.innerWidth);
    const gapCenters = [0.34, 0.56, 0.42, 0.62, 0.38];
    const startX = gameWidth * 0.58;
    const spacing = Math.max(620, gameWidth * 0.54);

    state.flappy.objectsLayer.innerHTML = "";
    state.flappy.groups = FLAPPY_ITEMS.map((item, index) => {
        const group = {
            item,
            x: startX + index * spacing,
            gapCenterRatio: gapCenters[index] || 0.48,
            pickupOffset: 0,
            pickupRatio: 0,
            collected: state.foundSigns.has(item.title),
            top: document.createElement("div"),
            bottom: document.createElement("div"),
            backdrop: document.createElement("div"),
            pickup: document.createElement("div"),
        };
        randomizeFlappyPickup(group);

        group.top.className = "flappy-pillar top";
        group.bottom.className = "flappy-pillar bottom";
        group.backdrop.className = "flappy-gap-bg";
        group.backdrop.hidden = false;
        group.backdrop.style.backgroundImage = `url("${item.background}")`;
        group.pickup.className = "flappy-pickup";
        group.pickup.hidden = group.collected;
        group.pickup.innerHTML = `<img src="${item.photo}" alt="">`;
        group.pickup.classList.toggle("is-collected", group.collected);

        state.flappy.objectsLayer.append(group.backdrop, group.top, group.bottom, group.pickup);
        positionFlappyGroup(screen, group);
        return group;
    });
}

function randomizeFlappyPickup(group) {
    group.pickupOffset = 78 + Math.random() * 74;
    group.pickupRatio = 0.18 + Math.random() * 0.64;
}

function positionFlappyGroup(screen, group) {
    const { game } = screenState.get(screen).flappy;
    const height = game.clientHeight || 560;
    const gap = Math.max(188, Math.min(240, height * 0.34));
    const gapCenter = Math.max(gap / 2 + 28, Math.min(height - gap / 2 - 36, height * group.gapCenterRatio));
    const topHeight = Math.max(20, gapCenter - gap / 2);
    const bottomTop = gapCenter + gap / 2;
    const pickupHeight = group.pickup.offsetHeight || 68;
    const pickupWidth = group.pickup.offsetWidth || 88;
    const spaceWidth = Math.max(520, game.clientWidth * 0.54);
    const backdropWidth = spaceWidth;
    const backdropHeight = height;
    const backdropX = group.x - spaceWidth;
    const backdropY = 0;
    const pickupX = backdropX + (backdropWidth - pickupWidth) / 2;
    const pickupY = Math.max(42, Math.min(height - pickupHeight - 42, height * (0.24 + group.pickupRatio * 0.42)));

    group.backdrop.style.width = `${backdropWidth}px`;
    group.backdrop.style.height = `${backdropHeight}px`;
    group.top.style.height = `${topHeight}px`;
    group.bottom.style.top = `${bottomTop}px`;
    group.bottom.style.height = `${Math.max(30, height - bottomTop)}px`;
    group.backdrop.style.transform = `translate3d(${backdropX}px, ${backdropY}px, 0)`;
    group.top.style.transform = `translate3d(${group.x}px, 0, 0)`;
    group.bottom.style.transform = `translate3d(${group.x}px, 0, 0)`;
    group.pickup.style.transform = `translate3d(${pickupX}px, ${pickupY}px, 0)`;
}

function flap(screen) {
    const state = screenState.get(screen);
    if (!state?.flappy || state.completed || state.flappy.gameOver) {
        return;
    }

    state.flappy.game.focus({ preventScroll: true });
    state.flappy.velocity = -8.6;
    state.flappy.paused = false;
    screen.classList.add("is-started");

    if (!state.flappy.started) {
        state.flappy.started = true;
        state.flappy.lastTime = performance.now();
        state.flappy.raf = window.requestAnimationFrame((time) => tickFlappy(screen, time));
    }
}

function tickFlappy(screen, time) {
    const state = screenState.get(screen);
    const flappy = state?.flappy;
    if (!flappy || flappy.paused || state.completed) {
        return;
    }

    const delta = Math.min(32, time - flappy.lastTime || 16) / 16;
    flappy.lastTime = time;
    flappy.velocity += 0.42 * delta;
    flappy.birdY += flappy.velocity * delta;

    const gameHeight = flappy.game.clientHeight || 560;
    const birdHeight = flappy.bird.offsetHeight || 26;
    if (flappy.birdY < 0 || flappy.birdY > gameHeight - birdHeight) {
        loseFlappyGame(screen, "падение");
        return;
    }

    flappy.groups.forEach((group) => {
        group.x -= 3.2 * delta;
        if (hasPassedFlappyBird(flappy, group)) {
            recycleFlappyGroup(flappy, group);
        }
        positionFlappyGroup(screen, group);
    });

    flappy.bird.style.transform = `translate3d(0, ${flappy.birdY}px, 0)`;
    checkFlappyCollisions(screen);
    if (flappy.paused || state.completed) {
        return;
    }
    flappy.raf = window.requestAnimationFrame((nextTime) => tickFlappy(screen, nextTime));
}

function hasPassedFlappyBird(flappy, group) {
    const birdX = flappy.bird.offsetLeft || flappy.game.clientWidth * 0.11;
    const pillarWidth = group.top.offsetWidth || 112;
    return group.x + pillarWidth < birdX;
}

function recycleFlappyGroup(flappy, group) {
    group.x = getRightmostFlappyX(flappy.groups, group) + Math.max(620, flappy.game.clientWidth * 0.54);
    randomizeFlappyPickup(group);
}

function getRightmostFlappyX(groups, excludedGroup) {
    return groups.reduce((right, group) => {
        if (group === excludedGroup) {
            return right;
        }
        return Math.max(right, group.x);
    }, 0);
}

function resetFlappyBird(screen) {
    const state = screenState.get(screen);
    const flappy = state?.flappy;
    if (!flappy) {
        return;
    }

    flappy.birdY = Math.max(120, (flappy.game.clientHeight || 560) * 0.42);
    flappy.velocity = 0;
    flappy.bird.style.transform = `translate3d(0, ${flappy.birdY}px, 0)`;
}

function checkFlappyCollisions(screen) {
    const state = screenState.get(screen);
    const flappy = state?.flappy;
    if (!flappy) {
        return;
    }

    const birdRect = flappy.bird.getBoundingClientRect();
    flappy.groups.forEach((group) => {
        const hitPillar = intersects(birdRect, group.top.getBoundingClientRect())
            || intersects(birdRect, group.bottom.getBoundingClientRect());
        if (hitPillar) {
            state.wrongAttempts.add("столб-препятствие");
            loseFlappyGame(screen, "столб-препятствие");
            return;
        }

        if (!group.collected && intersects(birdRect, group.pickup.getBoundingClientRect())) {
            collectFlappyItem(screen, group);
        }
    });
}

function intersects(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function loseFlappyGame(screen, reason) {
    const state = screenState.get(screen);
    if (!state?.flappy || state.flappy.gameOver) {
        return;
    }

    state.wrongAttempts.add(reason);
    recordTopicError(screen);
    state.flappy.gameOver = true;
    pauseFlappy(screen);
    screen.classList.add("is-game-over");
    screen.querySelector(".flappy-game-over").hidden = false;
}

function restartFlappyGame(screen) {
    const state = screenState.get(screen);
    if (!state?.flappy) {
        return;
    }

    pauseFlappy(screen);
    state.completed = false;
    state.completionShown = false;
    state.foundSigns.clear();
    state.wrongAttempts.clear();
    state.flappy.started = false;
    state.flappy.gameOver = false;
    state.flappy.paused = false;
    state.flappy.velocity = 0;
    state.flappy.lastTime = 0;
    recordMetric("flappyRestarts");
    localStorage.removeItem(screen.dataset.storageKey);
    screen.classList.remove("is-started", "is-game-over");
    screen.querySelector(".flappy-game-over").hidden = true;
    screen.querySelector(".flappy-win").hidden = true;
    buildFlappyObjects(screen, state);
    resetFlappyBird(screen);
}

function collectFlappyItem(screen, group) {
    const state = screenState.get(screen);
    if (!state || group.collected) {
        return;
    }

    group.collected = true;
    pauseFlappy(screen);
    openReinforcementModal(screen, group.item, group);
}

function pauseFlappy(screen) {
    const state = screenState.get(screen);
    if (!state?.flappy) {
        return;
    }

    state.flappy.paused = true;
    window.cancelAnimationFrame(state.flappy.raf);
}

function resumeFlappy(screen) {
    const state = screenState.get(screen);
    if (!state?.flappy || state.completed || !state.flappy.started) {
        return;
    }

    state.flappy.paused = false;
    state.flappy.lastTime = performance.now();
    state.flappy.raf = window.requestAnimationFrame((time) => tickFlappy(screen, time));
}

function openReinforcementModal(screen, item, group) {
    if (!reinforcementModal) {
        return;
    }

    activeFlappyScreen = screen;
    activeFlappyGroup = group;
    reinforcementImage.src = item.photo;
    reinforcementImage.alt = item.title;
    reinforcementTitle.textContent = item.title;
    reinforcementDescription.textContent = item.description;
    reinforcementModal.hidden = false;
    document.body.classList.add("decision-open");
}

function closeReinforcementModal() {
    if (!reinforcementModal) {
        return;
    }

    reinforcementModal.hidden = true;
    document.body.classList.remove("decision-open");
    const screen = activeFlappyScreen;
    const group = activeFlappyGroup;
    activeFlappyScreen = null;
    activeFlappyGroup = null;

    if (screen) {
        finishFlappyCollection(screen, group);
        resumeFlappy(screen);
    }
}

function finishFlappyCollection(screen, group) {
    const state = screenState.get(screen);
    if (!state || !group) {
        return;
    }

    group.pickup.hidden = true;
    group.pickup.classList.add("is-collected");
    if (!state.foundSigns.has(group.item.title)) {
        recordMetric("correctActions");
    }
    state.foundSigns.add(group.item.title);
    updateProgress(screen);
}

function openDecisionModal(screen, zone) {
    const state = screenState.get(screen);
    const zoneConfig = DECISION_ZONES[zone.dataset.zone];
    if (!zoneConfig || !state) {
        return;
    }

    if (guidePanel.classList.contains("is-open")) {
        closeGuide();
    }

    activeDecision = { screen, zone, config: zoneConfig };
    state.zoneChoices[zone.dataset.zone] = state.zoneChoices[zone.dataset.zone] || {
        observe: zone.classList.contains("is-verified"),
        protect: zone.classList.contains("is-verified"),
    };

    decisionZoneLabel.textContent = zoneConfig.zoneLabel;
    decisionTitle.textContent = zoneConfig.title;
    decisionDescription.textContent = zoneConfig.description;
    decisionHint.textContent = "Выберите по одному варианту в каждом блоке.";
    decisionOptionGroups.forEach((group) => {
        const groupName = group.dataset.options;
        const options = shuffleOptions(groupName === "observe" ? zoneConfig.observeOptions : zoneConfig.protectOptions);
        const correct = groupName === "observe" ? zoneConfig.observeCorrect : zoneConfig.protectCorrect;
        group.innerHTML = "";

        options.forEach((option) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option;
            button.dataset.group = groupName;
            button.dataset.correct = String(option === correct);
            button.className = "decision-option";
            if (state.zoneChoices[zone.dataset.zone][groupName] && option === correct) {
                button.classList.add("is-correct");
            }
            button.addEventListener("click", () => handleDecisionChoice(button));
            group.append(button);
        });
    });

    decisionModal.hidden = false;
    document.body.classList.add("decision-open");
}

function closeDecisionModal() {
    decisionModal.hidden = true;
    document.body.classList.remove("decision-open");
    activeDecision = null;
}

function handleDecisionChoice(button) {
    if (!activeDecision) {
        return;
    }

    const { screen, zone, config } = activeDecision;
    const state = screenState.get(screen);
    const groupName = button.dataset.group;
    const isCorrect = button.dataset.correct === "true";
    const group = button.closest(".decision-options");

    group.querySelectorAll(".decision-option").forEach((option) => {
        option.classList.remove("is-wrong");
        if (option.dataset.group === groupName && option.dataset.correct !== "true") {
            option.classList.remove("is-correct");
        }
    });

    if (!isCorrect) {
        button.classList.add("is-wrong");
        state.wrongAttempts.add(button.textContent.trim());
        recordTopicError(screen);
        decisionHint.textContent = "Не совсем. Этот вариант относится к другой инженерной задаче.";
        return;
    }

    button.classList.add("is-correct");
    state.zoneChoices[zone.dataset.zone][groupName] = true;
    decisionHint.textContent = "Верно. Осталось выбрать второй блок решения.";

    if (state.zoneChoices[zone.dataset.zone].observe && state.zoneChoices[zone.dataset.zone].protect) {
        verifyDecisionZone(screen, zone, config);
    }
}

function verifyDecisionZone(screen, zone, config) {
    const state = screenState.get(screen);
    if (zone.classList.contains("is-verified")) {
        decisionHint.textContent = "Эта зона уже проверена.";
        return;
    }

    zone.classList.add("is-verified");
    recordMetric("correctActions");
    state.foundSigns.add(config.shortLabel);
    decisionHint.textContent = config.reason;
    showExpertPraise(screen);
    updateProgress(screen);

    window.setTimeout(() => {
        if (activeDecision?.zone === zone) {
            closeDecisionModal();
        }
    }, 1300);
}

function showExpertPraise(screen) {
    const feedbackCard = screen.querySelector(".feedback-card");
    const feedbackTitle = feedbackCard?.querySelector(".feedback-title");
    const feedbackText = feedbackCard?.querySelector(".feedback-text");
    const expertImage = screen.querySelector(".field-expert-image");

    if (!feedbackCard || !feedbackTitle || !feedbackText) {
        return;
    }

    const previousTimer = feedbackHideTimers.get(feedbackCard);
    if (previousTimer) {
        window.clearTimeout(previousTimer);
    }

    feedbackTitle.textContent = "Класс!";
    feedbackText.textContent = "";
    feedbackTitle.dataset.icon = "";
    feedbackText.classList.remove("is-typing");
    feedbackCard.classList.remove("is-negative");
    feedbackCard.classList.add("is-positive", "is-praise");
    feedbackCard.setAttribute("aria-hidden", "false");
    updateExpertImage(expertImage, true);
    void feedbackCard.offsetWidth;
    feedbackCard.classList.add("is-visible");

    const hideTimer = window.setTimeout(() => {
        feedbackCard.classList.remove("is-visible", "is-praise");
        feedbackCard.setAttribute("aria-hidden", "true");
        expertImage?.classList.remove("is-reacting");
        updateExpertImage(expertImage, false, false);
        feedbackHideTimers.delete(feedbackCard);
    }, 1900);

    feedbackHideTimers.set(feedbackCard, hideTimer);
}

function handleHotspotClick(screen, hotspot) {
    const state = screenState.get(screen);
    const config = getConfig(screen);
    const isCorrect = hotspot.dataset.kind === "correct";
    const label = hotspot.dataset.label;
    const icon = hotspot.dataset.icon || "•";
    const feedbackText = hotspot.dataset.feedback || (isCorrect ? config.correctFeedback : config.wrongFeedback);

    if (isCorrect) {
        hotspot.classList.add("is-correct");
        hotspot.querySelector(".hotspot-icon")?.classList.add("is-visible");
        if (!state.foundSigns.has(label)) {
            recordMetric("correctActions");
        }
        state.foundSigns.add(label);
        updateProgress(screen);
        showFeedback(screen, "✓", label, feedbackText, true, icon);
        return;
    }

    window.clearTimeout(Number(hotspot.dataset.resetTimer || 0));
    hotspot.classList.add("is-wrong");
    hotspot.querySelector(".hotspot-icon")?.classList.add("is-visible");
    state.wrongAttempts.add(label);
    recordTopicError(screen);
    showFeedback(screen, "×", label, feedbackText, false, icon);
    const resetTimer = window.setTimeout(() => {
        hotspot.classList.remove("is-wrong");
        hotspot.querySelector(".hotspot-icon")?.classList.remove("is-visible");
        delete hotspot.dataset.resetTimer;
    }, 1300);
    hotspot.dataset.resetTimer = String(resetTimer);
}

function updateProgress(screen) {
    const state = screenState.get(screen);
    const required = Number(screen.dataset.required);
    const countNode = screen.querySelector(".found-count");
    const signCounter = screen.querySelector(".sign-counter");
    const counterOrb = screen.querySelector(".counter-orb");
    const routeFill = screen.querySelector(".route-fill");
    const routeMarker = screen.querySelector(".route-marker");
    const routePoints = screen.querySelectorAll(".route-map li");
    const routeMap = screen.querySelector(".route-map");
    const stage = Math.max(1, Number(routeMap?.dataset.stage || 1));
    const stageCount = Math.max(1, routePoints.length - 1);
    const baseRouteProgress = (stage - 1) / stageCount;
    const nextRouteProgress = Math.min(1, stage / stageCount);
    const ratio = state.foundSigns.size / required;

    if (countNode) {
        countNode.textContent = `${state.foundSigns.size}/${required}`;
    }
    signCounter?.classList.toggle("is-complete", state.foundSigns.size === required);
    counterOrb?.classList.toggle("is-active", state.foundSigns.size > 0);

    if (routeFill && routeMarker) {
        const routeProgress = state.foundSigns.size === required
            ? nextRouteProgress
            : baseRouteProgress + (nextRouteProgress - baseRouteProgress) * ratio * 0.72;
        setRouteState(screen, routeProgress);
    }

    setRoutePointState(screen, state.foundSigns.size === required ? stage : stage - 1);

    if (state.foundSigns.size === required) {
        completeScreen(screen, state);
    }
}

function setRouteState(screen, progress) {
    const routeFill = screen.querySelector(".route-fill");
    const routeMarker = screen.querySelector(".route-marker");

    if (!routeFill || !routeMarker) {
        return;
    }

    routeFill.style.height = `${progress * 100}%`;
    routeMarker.style.top = `${progress * 100}%`;
}

function getCompletedRouteProgress(screen) {
    const routePoints = screen.querySelectorAll(".route-map li");
    const stage = getCurrentStage(screen);
    const stageCount = Math.max(1, routePoints.length - 1);
    return Math.min(1, stage / stageCount);
}

function getCurrentStage(screen) {
    const routeMap = screen.querySelector(".route-map");
    return Math.max(1, Number(routeMap?.dataset.stage || 1));
}

function setRoutePointState(screen, activeIndex) {
    screen.querySelectorAll(".route-map li").forEach((point, index) => {
        point.classList.toggle("is-active", index === activeIndex);
        point.classList.toggle("is-complete", index < activeIndex);
    });
}

function completeScreen(screen, state) {
    if (state.completionShown) {
        return;
    }

    state.completed = true;
    state.completionShown = true;
    localStorage.setItem(screen.dataset.storageKey, "true");
    markStageCompleted(screen.dataset.storageKey);

    screen.querySelector(".continue-button")?.classList.add("is-visible");
    guideOpen.classList.add("has-pulse");
    activeScreen = screen;
    updateQuickQuestions();

    if (screen.classList.contains("flappy-screen")) {
        pauseFlappy(screen);
        const winMessage = screen.querySelector(".flappy-win");
        if (winMessage) {
            winMessage.hidden = false;
        }
        window.setTimeout(() => {
            openGuide();
            appendMessage(getConfig(screen).summary([...state.foundSigns], [...state.wrongAttempts]), "assistant summary");
        }, 720);
        return;
    }

    window.setTimeout(() => {
        openGuide();
        appendMessage(getConfig(screen).summary([...state.foundSigns], [...state.wrongAttempts]), "assistant summary");
    }, 420);
}

function showFeedback(screen, mark, title, text, positive, icon) {
    const feedbackCard = screen.querySelector(".feedback-card");
    const feedbackMark = feedbackCard.querySelector(".feedback-mark");
    const feedbackTitle = feedbackCard.querySelector(".feedback-title");
    const feedbackText = feedbackCard.querySelector(".feedback-text");
    const expertImage = screen.querySelector(".field-expert-image");

    if (feedbackMark) {
        feedbackMark.textContent = mark;
    }
    feedbackTitle.textContent = title;
    feedbackTitle.dataset.icon = icon;
    feedbackCard.classList.toggle("is-positive", positive);
    feedbackCard.classList.toggle("is-negative", !positive);
    feedbackCard.setAttribute("aria-hidden", "false");
    feedbackCard.classList.remove("is-visible");
    updateExpertImage(expertImage, positive);
    typeFeedbackText(feedbackText, text);
    void feedbackCard.offsetWidth;
    feedbackCard.classList.add("is-visible");
    scheduleFeedbackHide(feedbackCard, feedbackText, expertImage, text);
}

function updateExpertImage(image, shouldUseSuccessImage, animate = true) {
    if (!image) {
        return;
    }

    const nextSrc = shouldUseSuccessImage ? image.dataset.trueSrc : image.dataset.idleSrc;
    if (nextSrc && !image.src.endsWith(nextSrc)) {
        image.src = nextSrc;
    }

    image.classList.remove("is-reacting");
    if (!animate) {
        return;
    }

    window.requestAnimationFrame(() => {
        image.classList.add("is-reacting");
        window.setTimeout(() => image.classList.remove("is-reacting"), 520);
    });
}

function typeFeedbackText(node, text) {
    const previousTimer = feedbackTypingTimers.get(node);
    if (previousTimer) {
        window.clearInterval(previousTimer);
    }

    node.textContent = "";
    node.classList.add("is-typing");

    let index = 0;
    const timer = window.setInterval(() => {
        node.textContent += text[index] || "";
        index += 1;

        if (index >= text.length) {
            window.clearInterval(timer);
            feedbackTypingTimers.delete(node);
            node.classList.remove("is-typing");
        }
    }, 22);

    feedbackTypingTimers.set(node, timer);
}

function scheduleFeedbackHide(card, textNode, image, text) {
    const previousTimer = feedbackHideTimers.get(card);
    if (previousTimer) {
        window.clearTimeout(previousTimer);
    }

    const typingDuration = text.length * 22;
    const visibleAfterTyping = 2400;
    const hideTimer = window.setTimeout(() => {
        const typingTimer = feedbackTypingTimers.get(textNode);
        if (typingTimer) {
            window.clearInterval(typingTimer);
            feedbackTypingTimers.delete(textNode);
        }

        card.classList.remove("is-visible");
        card.setAttribute("aria-hidden", "true");
        textNode.classList.remove("is-typing");
        image?.classList.remove("is-reacting");
        updateExpertImage(image, false, false);
        feedbackHideTimers.delete(card);
    }, typingDuration + visibleAfterTyping);

    feedbackHideTimers.set(card, hideTimer);
}

function setupGalleries() {
    document.querySelectorAll(".location-gallery").forEach((gallery) => {
        const images = [...gallery.querySelectorAll(".gallery-track img")];
        const previous = gallery.querySelector(".gallery-prev");
        const next = gallery.querySelector(".gallery-next");
        let activeIndex = Math.max(0, images.findIndex((image) => image.classList.contains("is-active")));

        const showImage = (nextIndex) => {
            if (!images.length) {
                return;
            }

            images[activeIndex]?.classList.remove("is-active");
            activeIndex = (nextIndex + images.length) % images.length;
            images[activeIndex].classList.add("is-active");
        };

        previous?.addEventListener("click", () => showImage(activeIndex - 1));
        next?.addEventListener("click", () => showImage(activeIndex + 1));
    });
}

function openGuide() {
    guideBackdrop.hidden = false;
    guidePanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("guide-open");
    guidePanel.classList.add("is-open");
    guideBackdrop.classList.add("is-visible");
    updateQuickQuestions();
    window.setTimeout(() => guideInput.focus(), 80);
}

function closeGuide() {
    if (guidePanel.contains(document.activeElement)) {
        guideOpen.focus({ preventScroll: true });
    }

    guidePanel.classList.remove("is-open");
    guideBackdrop.classList.remove("is-visible");
    document.body.classList.remove("guide-open");
    guidePanel.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
        if (!guidePanel.classList.contains("is-open")) {
            guideBackdrop.hidden = true;
        }
    }, 240);
}

async function sendGuideQuestion(question) {
    appendMessage(question, "user");
    const pending = appendTypingMessage();
    const context = getActiveContext();

    try {
        const response = await fetch("/api/geogid/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ message: question, context }),
        });

        const data = await response.json();
        const answer = data.answer || data.error || "Не получилось получить ответ. Попробуйте ещё раз.";
        await typeMessage(pending, answer);
    } catch (error) {
        await typeMessage(pending, "Связь с GeoChat прервалась. Проверьте запуск сервера и попробуйте снова.");
    } finally {
        pending.classList.remove("is-loading", "typing");
        guideChat.scrollTop = guideChat.scrollHeight;
    }
}

function appendTypingMessage() {
    const message = appendMessage("GeoChat печатает", "assistant is-loading typing");
    return message;
}

async function typeMessage(message, text) {
    message.classList.remove("typing");
    message.textContent = "";
    const cleanText = cleanGuideText(text);

    for (const char of cleanText) {
        message.textContent += char;
        guideChat.scrollTop = guideChat.scrollHeight;
        await delay(char === "\n" ? 80 : 13);
    }
}

function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function appendMessage(text, className) {
    const message = document.createElement("article");
    message.className = `chat-message ${className}`;
    message.textContent = className.includes("assistant") ? cleanGuideText(text) : text;
    guideChat.append(message);
    guideChat.scrollTop = guideChat.scrollHeight;
    return message;
}

function cleanGuideText(text) {
    return String(text || "")
        .replace(/\*/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .trim();
}

function updateQuickQuestions() {
    const config = getConfig(activeScreen);
    const state = screenState.get(activeScreen);
    updateGuideIntro(config);
    const shouldHide = (
        activeScreen?.classList.contains("screen-kamennomostsky")
        || activeScreen?.classList.contains("decision-screen")
        || activeScreen?.classList.contains("flappy-screen")
    ) && !state?.completed;

    quickQuestions.hidden = shouldHide;
    quickQuestions.open = false;
    quickQuestionList.innerHTML = "";

    config.quickQuestions.forEach((question) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = question;
        button.addEventListener("click", async () => {
            openGuide();
            await sendGuideQuestion(question);
        });
        quickQuestionList.append(button);
    });
}

function updateGuideIntro(config = getConfig(activeScreen)) {
    if (!guideIntro) {
        return;
    }

    guideIntro.textContent = cleanGuideText(config.guideIntro || SCREEN_CONFIG["Лаго-Наки"].guideIntro);
}

function getConfig(screen) {
    return SCREEN_CONFIG[screen?.dataset.location] || SCREEN_CONFIG["Лаго-Наки"];
}

function getActiveContext() {
    return {
        location: activeScreen?.dataset.location || "Лаго-Наки",
        topic: activeScreen?.dataset.topic || "геологическая безопасность",
    };
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return "";
}

function transitionTo(selector) {
    if (isRouteTransitioning) {
        return;
    }

    const target = document.querySelector(selector);
    if (!target) {
        return;
    }

    const currentScreen = screens[currentScreenIndex];
    const state = screenState.get(currentScreen);
    const targetScreenIndex = screens.indexOf(target);
    const trackChildren = [...track.children];
    const targetTrackIndex = trackChildren.indexOf(target);

    if (!state?.completed || targetTrackIndex === -1) {
        return;
    }

    if (targetScreenIndex !== -1 && targetScreenIndex !== currentScreenIndex + 1) {
        return;
    }

    if (targetScreenIndex === -1 && currentScreenIndex !== screens.length - 1) {
        return;
    }

    if (currentScreen?.classList.contains("flappy-screen")) {
        pauseFlappy(currentScreen);
    }

    if (guidePanel.classList.contains("is-open")) {
        closeGuide();
    }

    isRouteTransitioning = true;
    document.body.classList.add("is-route-transitioning");

    if (targetScreenIndex !== -1) {
        currentScreenIndex = targetScreenIndex;
        activeScreen = screens[currentScreenIndex];
        updateQuickQuestions();
    }

    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            setTrackPosition(targetTrackIndex);
        });
    });

    const finishTransition = () => {
        document.body.classList.remove("is-route-transitioning");
        isRouteTransitioning = false;
        if (targetScreenIndex !== -1) {
            setTrackPosition(currentScreenIndex);
        }
    };

    const fallbackTimer = window.setTimeout(finishTransition, 1900);
    track.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "transform") {
            return;
        }

        window.clearTimeout(fallbackTimer);
        finishTransition();
    }, { once: true });
}

function setupRouteNavigation() {
    document.querySelectorAll(".route-map li").forEach((point, index) => {
        const targetIndex = index % screens.length;
        point.tabIndex = 0;
        point.setAttribute("role", "button");
        point.setAttribute("aria-label", `Перейти к локации ${targetIndex + 1}`);
        point.addEventListener("click", () => jumpToScreenIndex(targetIndex));
        point.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                jumpToScreenIndex(targetIndex);
            }
        });
    });
}

function jumpToScreenIndex(index) {
    if (!screens[index]) {
        return;
    }

    if (isRouteTransitioning) {
        document.body.classList.remove("is-route-transitioning");
        isRouteTransitioning = false;
    }

    const currentScreen = screens[currentScreenIndex];
    if (currentScreen?.classList.contains("flappy-screen")) {
        pauseFlappy(currentScreen);
    }

    if (guidePanel.classList.contains("is-open")) {
        closeGuide();
    }

    if (!decisionModal?.hidden) {
        closeDecisionModal();
    }

    if (!reinforcementModal?.hidden) {
        reinforcementModal.hidden = true;
        document.body.classList.remove("decision-open");
        activeFlappyScreen = null;
        activeFlappyGroup = null;
    }

    if (index === currentScreenIndex) {
        setTrackPosition(index);
        return;
    }

    currentScreenIndex = index;
    activeScreen = screens[currentScreenIndex];
    updateQuickQuestions();
    localStorage.setItem(ACTIVE_SCREEN_KEY, String(currentScreenIndex));
    updateResultSummary();

    isRouteTransitioning = true;
    document.body.classList.add("is-route-transitioning");
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTrackPosition(currentScreenIndex));
    });

    const finishTransition = () => {
        document.body.classList.remove("is-route-transitioning");
        isRouteTransitioning = false;
        setTrackPosition(currentScreenIndex);
    };

    const fallbackTimer = window.setTimeout(finishTransition, 1900);
    track.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "transform") {
            return;
        }

        window.clearTimeout(fallbackTimer);
        finishTransition();
    }, { once: true });
}

function getVisibleScreen() {
    const viewportCenter = window.innerHeight / 2;
    return screens
        .map((screen) => {
            const rect = screen.getBoundingClientRect();
            return {
                screen,
                distance: Math.abs(rect.top + rect.height / 2 - viewportCenter),
            };
        })
        .sort((a, b) => a.distance - b.distance)[0]?.screen || activeScreen;
}

function getVisibleFlappyScreen() {
    const visibleScreen = getVisibleScreen();
    if (visibleScreen?.classList.contains("flappy-screen")) {
        return visibleScreen;
    }

    return screens.find((screen) => {
        if (!screen.classList.contains("flappy-screen")) {
            return false;
        }

        const rect = screen.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.28;
    });
}

function goToScreen3() {
    transitionTo("#screen-fisht-hadzhokh");
}

window.goToScreen3 = goToScreen3;

function setTrackPosition(index) {
    if (!track) {
        return;
    }

    const offset = -index * (window.innerHeight + getSceneGapPixels());
    track.style.setProperty("--active-screen", String(index));
    track.style.setProperty("--track-offset", `${offset}px`);
}

function getSceneGapPixels() {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--scene-gap").trim();
    const amount = Number.parseFloat(value);

    if (!Number.isFinite(amount)) {
        return 0;
    }

    if (value.endsWith("vh")) {
        return window.innerHeight * amount / 100;
    }

    if (value.endsWith("rem")) {
        return amount * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    if (value.endsWith("px")) {
        return amount;
    }

    return amount;
}

function getInitialScreenIndex() {
    const stored = Number(localStorage.getItem(ACTIVE_SCREEN_KEY) || 0);
    if (!Number.isInteger(stored) || stored < 0 || stored >= screens.length) {
        return 0;
    }
    return stored;
}

function resetProgressIfNeeded() {
    if (localStorage.getItem(APP_STORAGE_VERSION_KEY) === APP_STORAGE_VERSION) {
        return;
    }

    Object.keys(localStorage)
        .filter((key) => key.startsWith("geoshield-"))
        .forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(APP_STORAGE_VERSION_KEY, APP_STORAGE_VERSION);
}
