import { useEffect, useMemo, useRef, useState } from "react";

type Topic = "karst" | "landslide" | "rockfall" | "protection";
type Difficulty = "beginner" | "medium" | "advanced";
type HintMode = "always" | "on-demand" | "off";

type ExpeditionForm = {
  learnerId: string;
  topic: Topic;
  difficulty: Difficulty;
  taskCount: number;
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

type RouteTask = {
  id: string;
  title: string;
  prompt: string;
  answer: string;
  explanation: string;
};

type PersonalRoute = {
  id: string;
  learnerId: string;
  form: ExpeditionForm;
  tasks: RouteTask[];
  createdAt: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";
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
    taskCount: 4,
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
  const routeRef = useRef<HTMLElement>(null);
  const shouldRevealRoute = useRef(false);

  function revealRoute() {
    shouldRevealRoute.current = true;
    setCreated(true);
    window.setTimeout(() => setCreated(false), 2200);
  }

  useEffect(() => {
    if (!route || !shouldRevealRoute.current) return;
    shouldRevealRoute.current = false;
    window.requestAnimationFrame(() => {
      routeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      routeRef.current?.focus({ preventScroll: true });
    });
  }, [route]);

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
      setRoute(routeData.route);
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
          setRoute(message.payload);
          setNotice("MCP создал персональный маршрут.");
          revealRoute();
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
      setRoute(data.route);
      setNotice("Маршрут создан. Можно начинать новую экспедицию.");
      revealRoute();
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
          <a className="brand" href="http://127.0.0.1:8000/">
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
              <span>Количество заданий: <b>{form.taskCount}</b></span>
              <input type="range" min="3" max="6" step="1" value={form.taskCount} onChange={(event) => update("taskCount", Number(event.target.value))} />
              <div className="range-labels"><span>3 — короткая</span><span>6 — полная</span></div>
            </label>

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
              {submitting ? "Собираем маршрут…" : created ? "Экспедиция создана" : "Создать экспедицию"}
              <span aria-hidden="true">{created ? "✓" : "→"}</span>
            </button>
          </form>
        </div>
      </section>

      {route && (
        <section className="route-section" ref={routeRef} tabIndex={-1} aria-live="polite">
          <div className="route-title">
            <div>
              <p className="section-label">Маршрут готов</p>
              <h2>{topicLabels[route.form.topic]}</h2>
            </div>
            <span>{route.tasks.length} заданий</span>
          </div>
          <ol className="task-list">
            {route.tasks.map((task, index) => (
              <li key={task.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{task.title}</h3><p>{task.prompt}</p><details><summary>Проверить ответ</summary><b>{task.answer}</b><p>{task.explanation}</p></details></div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer>Учебный проект · Геология Адыгеи · Vite + Bun + MCP</footer>
    </main>
  );
}
