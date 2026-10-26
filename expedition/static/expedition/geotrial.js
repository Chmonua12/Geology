/* GeoDrone — адаптивная мини-игра поверх экспедиции. */
(() => {
  "use strict";
  const SIZE = 7;
  const scenarios = {
    karst: {
      title: "Карстовая разведка", location: "Лаго-Наки",
      instruction: "Найди признаки карста и обходи зоны возможного провала.",
      danger: "Карстовые пустоты могут делать поверхность неустойчивой.",
      hazards: [[3,1],[3,2],[3,3],[2,4],[4,4]], extra: [[4,2],[1,5]],
      targets: [
        {pos:[1,1],icon:"💧",name:"Вода в трещинах",fact:"Вода проникает в трещины и постепенно растворяет известняк."},
        {pos:[5,1],icon:"🪨",name:"Известняк",fact:"В растворимых породах со временем возникают подземные пустоты."},
        {pos:[5,5],icon:"🔎",name:"Карстовая воронка",fact:"Воронки на поверхности могут указывать на карстовые процессы."}
      ]
    },
    landslide: {
      title: "Разведка оползня", location: "Каменномостский",
      instruction: "Собери признаки движения грунта, не заходя в опасные зоны.",
      danger: "Деформированные участки склона требуют осторожности.",
      hazards: [[2,2],[3,2],[4,2],[3,4],[4,4]], extra: [[1,5],[5,3]],
      targets: [
        {pos:[1,1],icon:"🌳",name:"Наклонённое дерево",fact:"Наклон деревьев может быть признаком смещения грунта."},
        {pos:[5,1],icon:"〰️",name:"Свежая трещина",fact:"Новые трещины могут свидетельствовать о деформации склона."},
        {pos:[5,5],icon:"💧",name:"Переувлажнение",fact:"Повышенная влажность иногда снижает устойчивость грунта."}
      ]
    },
    rockfall: {
      title: "Наблюдение за скалами", location: "Фишт и Хаджох",
      instruction: "Собери наблюдения, обходя опасные участки под скалами.",
      danger: "Под неустойчивыми скалами нельзя проводить наблюдения.",
      hazards: [[2,1],[2,2],[3,3],[4,3],[3,5]], extra: [[5,2],[1,5]],
      targets: [
        {pos:[1,1],icon:"🔭",name:"Осмотр трещин",fact:"Состояние трещин помогает оценивать изменения скальных массивов."},
        {pos:[5,1],icon:"📍",name:"Пункт наблюдения",fact:"Для осмотра выбирают безопасное место вне зоны падения камней."},
        {pos:[5,5],icon:"📷",name:"Фотофиксация",fact:"Повторные фотографии позволяют сравнивать изменения склонов."}
      ]
    },
    protection: {
      title: "Доставка защитных средств", location: "Инженерная защита",
      instruction: "Собери полезные инженерные решения для горного маршрута.",
      danger: "Это игровое препятствие. Дрон должен выбрать обходной путь.",
      hazards: [[2,1],[3,1],[4,1],[2,4],[4,4]], extra: [[3,3],[5,4]],
      targets: [
        {pos:[1,1],icon:"💦",name:"Дренаж",fact:"Дренаж помогает удалять избыток воды из грунта."},
        {pos:[5,2],icon:"🕸️",name:"Защитная сетка",fact:"Сетки применяют для защиты от падающих камней."},
        {pos:[5,5],icon:"🧱",name:"Габионы",fact:"Габионы могут укреплять основания склонов и берега."}
      ]
    }
  };
  const key = p => p.join(",");
  function create(options = {}) {
    const onResult = options.onResult || (() => {});
    const modal = document.createElement("dialog");
    modal.className = "gt-modal";
    modal.setAttribute("aria-labelledby", "gt-heading");
    modal.innerHTML = [
      '<div class="gt-frame"><header class="gt-header"><span>◈ ГЕОШТАБ / GEODRONE</span><button class="gt-exit" type="button" aria-label="Закрыть мини-игру">✕</button></header>',
      '<div class="gt-content"><section class="gt-info"><span class="gt-kicker">АДАПТИВНАЯ ЭКСПЕДИЦИЯ</span><h2 id="gt-heading"></h2>',
      '<p class="gt-description"></p><div class="gt-tags"><span class="gt-mode"></span><span class="gt-location"></span></div>',
      '<div class="gt-stats"><span>Наблюдения</span><strong class="gt-count"></strong></div><div class="gt-bar"><span class="gt-fill"></span></div>',
      '<p class="gt-feedback" role="status" aria-live="polite"></p><button class="gt-finish" type="button" hidden>Вернуться в экспедицию →</button></section>',
      '<section class="gt-game" aria-label="Поле разведки"><div class="gt-grid" role="grid" aria-label="Игровая карта семь на семь"></div>',
      '<p class="gt-legend">🚁 дрон &nbsp; ✨ находка &nbsp; ⚠ опасность</p>',
      '<div class="gt-controls" aria-label="Управление дроном"><button type="button" data-dir="0,-1" aria-label="Вверх">↑</button>',
      '<div><button type="button" data-dir="-1,0" aria-label="Влево">←</button><button type="button" data-dir="0,1" aria-label="Вниз">↓</button>',
      '<button type="button" data-dir="1,0" aria-label="Вправо">→</button></div></div></section></div></div>'
    ].join("");
    document.body.append(modal);
    const grid = modal.querySelector(".gt-grid");
    const feedback = modal.querySelector(".gt-feedback");
    const finishButton = modal.querySelector(".gt-finish");
    const exitButton = modal.querySelector(".gt-exit");
    const sessions = new Set();
    const mistakesByTopic = new Map();
    const streakByTopic = new Map();
    let game = null, previousFocus = null;
    function report(completed) {
      if (!game || game.reported) return;
      game.reported = true;
      try {
        onResult({
          topic:game.topic,mode:game.mode,source:game.source,completed,
          findings:game.found.size,mistakes:game.mistakes,steps:game.steps,
          durationSeconds:Math.min(999,Math.round((Date.now()-game.started)/1000))
        });
      } catch (error) { console.warn("GeoDrone: не удалось сохранить результат",error); }
    }
    function close() {
      if (!game) return;
      report(false);
      game = null;
      modal.close();
      if (previousFocus && previousFocus.isConnected) previousFocus.focus({preventScroll:true});
    }
    function draw() {
      if (!game) return;
      const targets = game.scenario.targets.slice(0,game.mode === "support" ? 2 : 3);
      const hazards = new Set(game.scenario.hazards.concat(game.mode === "challenge" ? game.scenario.extra : []).map(key));
      const points = new Map(targets.map(t => [key(t.pos),t]));
      const fragment = document.createDocumentFragment();
      for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++) {
        const square = document.createElement("button");
        const place = key([x,y]), item = points.get(place);
        const danger = hazards.has(place), found = game.found.has(place);
        const drone = game.player[0] === x && game.player[1] === y;
        square.type = "button";
        square.className = "gt-square" + (danger ? " gt-danger" : "") + (item && !found ? " gt-item" : "") + (found ? " gt-done" : "") + (drone ? " gt-drone" : "");
        square.textContent = drone ? "🚁" : danger ? "⚠" : item && !found ? item.icon : found ? "✓" : (x+y)%6 === 0 ? "·" : "";
        square.setAttribute("aria-label",drone ? "Дрон" : danger ? "Опасная зона" : item && !found ? item.name : "Пустая клетка");
        square.tabIndex = -1;
        square.addEventListener("click",() => {
          if (!game) return;
          const dx=x-game.player[0],dy=y-game.player[1];
          if(Math.abs(dx)+Math.abs(dy) === 1) move(dx,dy);
        });
        fragment.append(square);
      }
      grid.replaceChildren(fragment);
      modal.querySelector(".gt-count").textContent = game.found.size + "/" + targets.length;
      modal.querySelector(".gt-fill").style.width = Math.round(game.found.size / targets.length * 100) + "%";
    }
    function move(dx,dy) {
      if(!game || game.reported) return;
      const next=[game.player[0]+dx,game.player[1]+dy];
      if(next.some(n => n<0 || n>=SIZE)) { feedback.textContent="Край карты. Выбери другое направление.";return; }
      const hazards=game.scenario.hazards.concat(game.mode==="challenge"?game.scenario.extra:[]);
      if(hazards.some(p=>key(p)===key(next))) { game.mistakes++;feedback.textContent=game.scenario.danger+" Найди обход.";return; }
      game.player=next;game.steps++;
      const item=game.scenario.targets.slice(0,game.mode==="support"?2:3).find(t=>key(t.pos)===key(next));
      if(item && !game.found.has(key(next))) { game.found.add(key(next)); feedback.textContent=item.name+": "+item.fact; }
      draw();
      if(game.found.size===(game.mode==="support"?2:3)) {
        report(true);
        feedback.textContent="Разведка завершена! "+feedback.textContent;
        finishButton.hidden=false;
        finishButton.focus();
      }
    }
    function launch(topic,mode="support",source="automatic") {
      if(!scenarios[topic] || !["support","challenge"].includes(mode) || game) return false;
      const scenario=scenarios[topic];
      previousFocus=document.activeElement;
      game={topic,mode,source,scenario,player:[0,3],found:new Set(),steps:0,mistakes:0,started:Date.now(),reported:false};
      modal.querySelector("#gt-heading").textContent=scenario.title;
      modal.querySelector(".gt-description").textContent=scenario.instruction;
      modal.querySelector(".gt-location").textContent=scenario.location;
      modal.querySelector(".gt-mode").textContent=mode==="support"?"Учебная разведка":"Экспертная миссия";
      feedback.textContent=mode==="support"?"Собери две находки. Опасные клетки подсвечены.":"Собери три находки. Опасных участков стало больше.";
      finishButton.hidden=true;
      draw();modal.showModal();exitButton.focus();return true;
    }
    function recordError(topic) {
      if(!scenarios[topic]) return;
      streakByTopic.set(topic,0);
      const count=(mistakesByTopic.get(topic)||0)+1;
      mistakesByTopic.set(topic,count);
      if(count>=2 && !sessions.has(topic+":support")) {
        sessions.add(topic+":support");
        window.setTimeout(()=>launch(topic,"support"),900);
      }
    }
    function recordSuccess(topic) {
      if(!scenarios[topic]) return;
      const streak=(streakByTopic.get(topic)||0)+1;
      streakByTopic.set(topic,streak);
      if(streak>=3 && !sessions.has(topic+":challenge")) {
        sessions.add(topic+":challenge");
        window.setTimeout(()=>launch(topic,"challenge"),900);
      }
    }
    exitButton.addEventListener("click",close);
    finishButton.addEventListener("click",close);
    modal.addEventListener("cancel",e=>{e.preventDefault();close();});
    modal.addEventListener("keydown",e=>{
      const directions={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
      if(directions[e.key] && game && !game.reported) {e.preventDefault();move(...directions[e.key]);}
    });
    modal.querySelectorAll("[data-dir]").forEach(button=>
      button.addEventListener("click",()=>move(...button.dataset.dir.split(",").map(Number))));
    return {launch,recordError,recordSuccess,isOpen:()=>Boolean(game)};
  }
  window.GeoTrial={create};
})();
