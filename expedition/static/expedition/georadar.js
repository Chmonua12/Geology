/* ГеоРадар — обучающая мини-игра без переработки основных экранов. */
(() => {
  "use strict";

  const missions = {
    karst: {
      name: "Лаго-Наки", title: "Карст под наблюдением", symbol: "◈",
      subtitle: "Отличи признаки карстовой опасности от обычных объектов на плато.",
      rounds: [
        {
          scene: "На плато появилась новая особенность рельефа.",
          question: "Что требует проверки геологами?",
          answers: ["Свежая провальная воронка", "Ровная туристическая дорожка", "Тень от облака"],
          fact: "Новые провальные воронки могут быть связаны с карстом и подземными пустотами.",
          hint: "Обрати внимание на изменение самой поверхности земли."
        },
        {
          scene: "После дождей вода необычно быстро уходит с поверхности.",
          question: "Какой признак важен для карстовой разведки?",
          answers: ["Уход воды в трещины известняка", "Более яркая трава", "Изменение облачности"],
          fact: "Вода, проникая в трещины растворимых пород, способствует развитию карстовых процессов.",
          hint: "Подумай, куда уходит вода и с какой породой она взаимодействует."
        },
        {
          scene: "У тропы обнаружена подозрительная просадка.",
          question: "Как поступить безопаснее?",
          answers: ["Не приближаться и сообщить ответственным за маршрут", "Игнорировать просадку", "Считать любую воронку безопасной"],
          fact: "Подозрительные просадки требуют оценки специалистами; доступ к участку следует ограничить.",
          hint: "Необходимо предупредить людей об опасности, а не рисковать."
        }
      ]
    },
    landslide: {
      name: "Каменномостский", title: "Сигналы склона", symbol: "⌁",
      subtitle: "Научись отличать ранние признаки движения грунта.",
      rounds: [
        {
          scene: "После осадков команда осматривает склон.",
          question: "Какой объект указывает на возможное смещение грунта?",
          answers: ["Новые трещины на поверхности", "Сухие листья на тропе", "Облако над вершиной"],
          fact: "Новые трещины и деформации могут свидетельствовать о движении склона.",
          hint: "Ищи изменения грунта, а не погоды."
        },
        {
          scene: "Возле дороги изменился вид участка.",
          question: "Что стоит зафиксировать?",
          answers: ["Наклонившиеся столбы и деревья", "Обычный поворот дороги", "Ровный участок обочины"],
          fact: "Необычный наклон деревьев и конструкций может быть признаком деформации склона.",
          hint: "Вспомни, как смещение грунта влияет на вертикальные объекты."
        },
        {
          scene: "Грунт на склоне сильно переувлажнён.",
          question: "Какая мера может помочь снизить риск?",
          answers: ["Организовать водоотвод по проекту специалистов", "Увеличить поступление воды", "Не следить за изменениями склона"],
          fact: "Водоотвод уменьшает переувлажнение, которое может влиять на устойчивость склонов.",
          hint: "Нужно уменьшить поступление лишней воды в грунт."
        }
      ]
    },
    rockfall: {
      name: "Фишт и Хаджох", title: "Скальный патруль", symbol: "△",
      subtitle: "Проверь, какие признаки и действия важны при обвалах и осыпях.",
      rounds: [
        {
          scene: "Ниже скального обрыва появились обломки.",
          question: "Что может быть признаком недавнего камнепада?",
          answers: ["Свежие обломки у подножия", "Старая дорожная разметка", "Неподвижная тень"],
          fact: "Новые обломки у основания скалы могут указывать на недавнее падение камней.",
          hint: "Ищи следы разрушения скальной породы."
        },
        {
          scene: "Необходимо оценить состояние трещиноватого борта.",
          question: "Откуда вести наблюдения?",
          answers: ["Из безопасной точки вне зоны возможного падения", "Прямо под нависающими блоками", "С участка свежей осыпи"],
          fact: "Наблюдать скальные участки необходимо с безопасного расстояния.",
          hint: "Безопасная точка находится вне зоны возможного падения обломков."
        },
        {
          scene: "Над тропой выявлен опасный скальный участок.",
          question: "Какая мера может защищать проход от падающих камней?",
          answers: ["Улавливающие сетки и барьеры по проекту", "Только указатель маршрута", "Дополнительное освещение без защиты"],
          fact: "Специальные улавливающие конструкции применяются для защиты от камнепадов.",
          hint: "Нужна конструкция, которая действительно перехватывает обломки."
        }
      ]
    },
    protection: {
      name: "Инженерная защита", title: "Выбор инженера", symbol: "⬡",
      subtitle: "Подбери правильные защитные решения под разные опасности.",
      rounds: [
        {
          scene: "После дождя грунт на склоне переувлажнён.",
          question: "Что помогает отводить воду из грунта?",
          answers: ["Дренаж", "Сетка от камнепадов", "Туристический указатель"],
          fact: "Дренаж помогает удалять излишки воды и снижать переувлажнение грунта.",
          hint: "В данном случае нужно управлять водой."
        },
        {
          scene: "Над тропой есть риск падения камней.",
          question: "Какая защита подходит для такого участка?",
          answers: ["Улавливающая защитная сетка", "Только озеленение тропы", "Измерение температуры воздуха"],
          fact: "Улавливающие сетки и барьеры проектируют для задержания падающих камней.",
          hint: "Подумай, какая конструкция может задерживать обломки."
        },
        {
          scene: "Нужно укрепить подножие размываемого откоса.",
          question: "Какая конструкция может применяться?",
          answers: ["Габионы, подобранные инженером", "Лёгкая табличка", "Снегомер"],
          fact: "Габионы могут применяться для укрепления основания откосов и береговых участков.",
          hint: "Ищи конструкцию, которая работает как укрепление откоса."
        }
      ]
    }
  };

  function shuffle(answers) {
    const items = answers.map((text, index) => ({ text, correct: index === 0 }));
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function create({ onResult = () => {}, getActiveTopic = null } = {}) {
    const dialog = document.createElement("dialog");
    dialog.className = "gr-dialog";
    dialog.setAttribute("aria-labelledby", "gr-title");
    dialog.innerHTML = [
      '<div class="gr-artboard">',
      '<img class="gr-artwork" src="/static/expedition/georadar-frame.avif" alt="" aria-hidden="true" draggable="false">',
      '<button type="button" class="gr-close" aria-label="Закрыть окно">×</button>',
      '<section class="gr-panel">',
      '<h2 id="gr-title" class="gr-question"></h2>',
      '<div class="gr-answers" role="group" aria-label="Варианты ответа"></div>',
      '<p class="gr-feedback" role="status" aria-live="polite" hidden></p>',
      '<div class="gr-footer"><button type="button" class="gr-next" hidden>Следующий вопрос →</button></div>',
      '</section></div>'
    ].join("");
    document.body.append(dialog);

    const el = selector => dialog.querySelector(selector);
    const closeButton = el(".gr-close");
    const nextButton = el(".gr-next");
    const feedback = el(".gr-feedback");
    const answersNode = el(".gr-answers");
    const manuallyOpen = document.createElement("button");
    manuallyOpen.className = "gr-launcher";
    manuallyOpen.type = "button";
    manuallyOpen.textContent = "✺ Доп. задание";
    manuallyOpen.title = "Открыть дополнительное задание";
    document.body.append(manuallyOpen);

    const errorCounts = new Map();
    const successStreak = new Map();
    const triggered = new Set();
    let game = null;
    let lastFocus = null;

    function finish(completed) {
      if (!game || game.reported) return;
      game.reported = true;
      try {
        onResult({
          topic: game.topic,
          mode: game.mode,
          source: game.source,
          completed,
          correct: game.correct,
          mistakes: game.mistakes,
          durationSeconds: Math.min(999, Math.round((Date.now() - game.startedAt) / 1000))
        });
      } catch (error) {
        console.warn("GeoRadar: не удалось передать результат", error);
      }
    }

    function close() {
      if (!game) return;
      finish(false);
      game = null;
      dialog.close();
      if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
    }

    function draw() {
      if (!game) return;
      const round = game.mission.rounds[game.index];
      const total = game.mode === "support" ? 2 : 3;
      game.roundCorrect = false;
      el(".gr-question").textContent = round.question;
      nextButton.hidden = true;
      feedback.hidden = true;
      feedback.className = "gr-feedback";
      answersNode.replaceChildren();

      const chosen = shuffle(game.mode === "support" ? round.answers.slice(0, 2) : round.answers);
      for (const option of chosen) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gr-answer";
        button.textContent = option.text;
        button.addEventListener("click", () => choose(button, option.correct));
        answersNode.append(button);
      }
    }

    function choose(button, correct) {
      if (!game || game.roundCorrect) return;
      const round = game.mission.rounds[game.index];
      feedback.hidden = false;
      if (!correct) {
        game.mistakes += 1;
        button.classList.add("is-wrong");
        button.disabled = true;
        feedback.className = "gr-feedback is-wrong";
        feedback.textContent = "Не совсем. " + round.hint + " Попробуй другой вариант.";
        return;
      }
      game.roundCorrect = true;
      game.correct += 1;
      button.classList.add("is-correct");
      answersNode.querySelectorAll("button").forEach(option => { option.disabled = true; });
      feedback.className = "gr-feedback is-correct";
      feedback.textContent = "Верно! " + round.fact;
      nextButton.hidden = false;
      const total = game.mode === "support" ? 2 : 3;
      if (game.index + 1 === total) {
        nextButton.textContent = "Завершить разведку ✓";
      } else nextButton.textContent = "Следующая ситуация →";
    }

    function step() {
      if (!game || !game.roundCorrect) return;
      const total = game.mode === "support" ? 2 : 3;
      if (game.index + 1 >= total) {
        finish(true);
        close();
      } else {
        game.index += 1;
        draw();
      }
    }

    function launch(topic, mode = "support", source = "manual") {
      if (!missions[topic] || !["support", "challenge"].includes(mode) || game) return false;
      lastFocus = document.activeElement;
      game = {
        topic, mode, source, mission: missions[topic], index: 0,
        mistakes: 0, correct: 0, startedAt: Date.now(), roundCorrect: false, reported: false
      };
      draw();
      dialog.showModal();
      closeButton.focus();
      return true;
    }

    function currentTopic() {
      const active = getActiveTopic?.();
      if (missions[active]) return active;
      const screen = document.querySelector(".expedition-screen.is-active")
        || document.querySelectorAll(".expedition-screen")[Number(localStorage.getItem("geoshield-active-screen-index") || 0)];
      const id = screen?.id || "";
      if (id.includes("lago")) return "karst";
      if (id.includes("kamennomostsky")) return "landslide";
      if (id.includes("protection")) return "protection";
      if (id.includes("fisht")) return "rockfall";
      return "karst";
    }

    function queue(topic, mode) {
      if (triggered.has(topic + ":" + mode)) return;
      triggered.add(topic + ":" + mode);
      let checks = 0;
      const attempt = () => {
        const otherDialog = Array.from(document.querySelectorAll("dialog, .decision-modal, .reinforcement-modal"))
          .some(item => item !== dialog && (item.matches("dialog") ? item.open : !item.hidden));
        if ((game || otherDialog) && checks++ < 30) {
          window.setTimeout(attempt, 700);
          return;
        }
        if (!game && !otherDialog) launch(topic, mode, "adaptive");
      };
      window.setTimeout(attempt, 900);
    }

    function recordError(topic) {
      if (!missions[topic]) return;
      successStreak.set(topic, 0);
      const errors = (errorCounts.get(topic) || 0) + 1;
      errorCounts.set(topic, errors);
      if (errors >= 2) queue(topic, "support");
    }
    function recordSuccess(topic) {
      if (!missions[topic]) return;
      const successes = (successStreak.get(topic) || 0) + 1;
      successStreak.set(topic, successes);
      if (successes >= 3) queue(topic, "challenge");
    }

    manuallyOpen.addEventListener("click", () => launch(currentTopic(), "support", "manual"));
    closeButton.addEventListener("click", close);
    nextButton.addEventListener("click", step);
    dialog.addEventListener("cancel", event => { event.preventDefault(); close(); });
    return { launch, recordError, recordSuccess, isOpen: () => Boolean(game) };
  }

  window.GeoRadar = { create };
})();
