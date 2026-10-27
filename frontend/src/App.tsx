import { useEffect, useMemo, useState } from "react";

type Topic = "karst" | "landslide" | "rockfall" | "protection";
type Difficulty = "beginner" | "medium" | "advanced";
type HintMode = "always" | "on-demand" | "off";

type ExpeditionForm = {
  learnerId: string;
  topic: Topic;
  difficulty: Difficulty;
  hintMode: HintMode;
  reason: string;
};

type LearningProgress = {
  learnerId: string;
  completedStages: number;
  errors: number;
  hints: number;
  durationMinutes: number;
  topicErrors: Record<Topic, number>;
};

type PersonalRoute = {
  id: string;
  learnerId: string;
  form: ExpeditionForm;
  screenId: string;
  title: string;
  gameType: string;
  launchUrl: string;
  createdAt: string;
};

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:3001" : window.location.origin);
const SITE_URL = import.meta.env.VITE_SITE_URL || "http://127.0.0.1:8000";
const topicLabels: Record<Topic, string> = {
  karst: "Карстовые процессы",
  landslide: "Оползни",
  rockfall: "Обвалы и осыпи",
  protection: "Инженерная защита",
};

function resolveLearnerId() {
  const queryId = new URLSearchParams(location.search).get("learner")?.trim();
  const savedId = localStorage.getItem("geoshield-learner-id");
  const id = queryId || savedId || `student-${crypto.randomUUID().slice(0, 8)}`;
  localStorage.setItem("geoshield-learner-id", id);
  return id;
}

function defaultForm(learnerId: string): ExpeditionForm {
  return {
    learnerId,
    topic: "karst",
    difficulty: "medium",
    hintMode: "on-demand",
    reason: "Повторить тему, в которой было больше всего ошибок.",
  };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Ошибка API: ${response.status}`);
  return data as T;
}

export default function App() {
  const learnerId = useMemo(resolveLearnerId, []);
  const [form, setForm] = useState<ExpeditionForm>(() => defaultForm(learnerId));
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [route, setRoute] = useState<PersonalRoute | null>(null);
  const [connection, setConnection] = useState<"connecting" | "online" | "offline">("connecting");
  const [notice, setNotice] = useState("Загружаем данные экспедиции…");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  async function launchRoute(nextRoute: PersonalRoute) {
    setRoute(nextRoute);
    setCreated(true);
    setNotice(`Маршрут готов: ${nextRoute.title}. Переходим к игре…`);
    try {
      await fetch(nextRoute.launchUrl, { mode: "no-cors" });
      window.location.assign(nextRoute.launchUrl);
    } catch {
      setCreated(false);
      setNotice("Основной сайт не запущен. Откройте второй терминал и выполните: python manage.py runserver");
    }
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api<{ progress: LearningProgress | null }>(`/api/progress/${encodeURIComponent(learnerId)}`),
      api<{ draft: ExpeditionForm | null }>(`/api/draft/${encodeURIComponent(learnerId)}`),
      api<{ route: PersonalRoute | null }>(`/api/routes/latest/${encodeURIComponent(learnerId)}`),
    ]).then(([progressData, draftData, routeData]) => {
      if (cancelled) return;
      setProgress(progressData.progress);
      if (draftData.draft) setForm(draftData.draft);
      if (routeData.route?.launchUrl) setRoute(routeData.route);
      setNotice(draftData.draft ? "Черновик MCP загружен. Проверьте параметры." : "Можно настроить маршрут вручную или через MCP.");
    }).catch(() => {
      if (!cancelled) setNotice("API пока недоступен. Запустите bun run dev в корне проекта.");
    });

    const wsUrl = API_URL.replace(/^http/, "ws");
    let socket: WebSocket | null = null;
    let retryTimer = 0;

    const connect = () => {
      if (cancelled) return;
      setConnection("connecting");
      socket = new WebSocket(`${wsUrl}/ws?learnerId=${encodeURIComponent(learnerId)}`);
      socket.onopen = () => setConnection("online");
      socket.onerror = () => setConnection("offline");
      socket.onclose = () => {
        setConnection("offline");
        if (!cancelled) retryTimer = window.setTimeout(connect, 1500);
      };
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "form:update") {
          setForm(message.payload);
          setNotice("MCP заполнил форму. Проверьте данные и подтвердите создание.");
        }
        if (message.type === "route:created") {
          void launchRoute(message.payload);
        }
        if (message.type === "progress:update") setProgress(message.payload);
      };
    };
    connect();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
      socket?.close();
    };
  }, [learnerId]);

  const strongestGap = useMemo(() => {
    if (!progress) return null;
    return (Object.entries(progress.topicErrors) as [Topic, number][])
      .sort((a, b) => b[1] - a[1])[0];
  }, [progress]);

  function update<K extends keyof ExpeditionForm>(key: K, value: ExpeditionForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const data = await api<{ route: PersonalRoute }>("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
      await launchRoute(data.route);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Не удалось создать маршрут.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="hero">
        <nav className="topbar" aria-label="Навигация">
          <a className="brand" href={SITE_URL}>
            <span className="brand-mark" aria-hidden="true">▲</span>
            <span>Геощит Адыгеи</span>
          </a>
          <span className={`connection ${connection}`}>
            <i aria-hidden="true" /> {connection === "online" ? "MCP на связи" : connection === "connecting" ? "Подключение" : "Нет связи с API"}
          </span>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">Следующий маршрут</p>
          <h1>Персональная<br />экспедиция</h1>
          <p>Маршрут собирается по результатам прошлого прохождения: больше практики там, где было сложнее.</p>
        </div>
      </header>

      <section className="workspace" aria-label="Конструктор экспедиции">
        <aside className="progress-card">
          <p className="section-label">Ваши результаты</p>
          <h2>{progress ? "Данные найдены" : "Первое прохождение"}</h2>
          <div className="metrics">
            <div><strong>{progress?.completedStages ?? 0}/4</strong><span>этапа</span></div>
            <div><strong>{progress?.errors ?? 0}</strong><span>ошибок</span></div>
            <div><strong>{progress?.hints ?? 0}</strong><span>подсказок</span></div>
          </div>
          {strongestGap && strongestGap[1] > 0 ? (
            <div className="insight">
              <span>Зона роста</span>
              <strong>{topicLabels[strongestGap[0]]}</strong>
              <p>{strongestGap[1]} {strongestGap[1] === 1 ? "ошибка" : "ошибки"} в предыдущей экспедиции</p>
            </div>
          ) : (
            <div className="insight neutral">
              <span>Рекомендация</span>
              <strong>Начните с карста</strong>
              <p>После прохождения сайта рекомендации станут точнее.</p>
            </div>
          )}
          <div className="student-id">
            <span>ID ученика для MCP</span>
            <code>{learnerId}</code>
            <button type="button" onClick={() => navigator.clipboard.writeText(learnerId)}>Скопировать ID</button>
          </div>
        </aside>

        <div className="form-card">
          <div className="form-heading">
            <div>
              <p className="section-label">Конструктор маршрута</p>
              <h2>Настроить следующую экспедицию</h2>
            </div>
            <span className="step-badge">01 / 01</span>
          </div>

          <p className="notice" role="status">{notice}</p>

          <form onSubmit={submit}>
            <label>
              <span>Главная тема</span>
              <select value={form.topic} onChange={(event) => update("topic", event.target.value as Topic)}>
                {Object.entries(topicLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>

            <fieldset>
              <legend>Сложность</legend>
              <div className="choice-row three">
                {(["beginner", "medium", "advanced"] as Difficulty[]).map((value) => (
                  <label className={form.difficulty === value ? "selected" : ""} key={value}>
                    <input type="radio" name="difficulty" value={value} checked={form.difficulty === value} onChange={() => update("difficulty", value)} />
                    <strong>{value === "beginner" ? "Базовая" : value === "medium" ? "Средняя" : "Сложная"}</strong>
                    <small>{value === "beginner" ? "с подсказками" : value === "medium" ? "для закрепления" : "для проверки знаний"}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <label>
              <span>Режим подсказок</span>
              <select value={form.hintMode} onChange={(event) => update("hintMode", event.target.value as HintMode)}>
                <option value="always">Показывать всегда</option>
                <option value="on-demand">Только по запросу</option>
                <option value="off">Без подсказок</option>
              </select>
            </label>

            <label>
              <span>Почему выбран этот маршрут</span>
              <textarea minLength={8} maxLength={240} required rows={3} value={form.reason} onChange={(event) => update("reason", event.target.value)} />
            </label>

            <button className="submit" type="submit" disabled={submitting || connection === "offline"}>
              {submitting ? "Готовим игру…" : created ? "Переходим к игре" : "Создать и перейти к игре"}
              <span aria-hidden="true">{created ? "✓" : "→"}</span>
            </button>
          </form>
        </div>
      </section>

      {route && (
        <section className="route-section" aria-live="polite">
          <div className="route-title">
            <div>
              <p className="section-label">Игровой экран выбран</p>
              <h2>{route.title}</h2>
            </div>
            <span>{topicLabels[route.form.topic]}</span>
          </div>
          <p className="game-description">{route.gameType}. Это один из существующих экранов основного проекта, а не новое текстовое задание.</p>
          <a className="launch-game" href={route.launchUrl}>Открыть игровое задание <span aria-hidden="true">→</span></a>
        </section>
      )}

      <footer>Учебный проект · Геология Адыгеи · Vite + Bun + MCP</footer>
    </main>
  );
}
