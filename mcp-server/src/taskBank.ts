import type { ExpeditionForm, ExpeditionTask, PersonalRoute } from "./contracts";

export const taskBank: Record<ExpeditionForm["topic"], ExpeditionTask[]> = {
  karst: [
    { id: "karst-water", topic: "karst", title: "Вода в трещинах", prompt: "Почему вода повышает карстовую опасность в известняке?", answer: "Вода растворяет породу и расширяет пустоты.", explanation: "Движение воды постепенно увеличивает трещины и подземные полости." },
    { id: "karst-funnel", topic: "karst", title: "Карстовая воронка", prompt: "Какой видимый признак может указывать на подземную пустоту?", answer: "Воронка или локальная просадка поверхности.", explanation: "Просадка появляется, когда свод полости теряет устойчивость." },
    { id: "karst-rock", topic: "karst", title: "Растворимая порода", prompt: "Какая порода особенно связана с карстом на Лаго-Наки?", answer: "Известняк.", explanation: "Известняк растворяется слабокислой природной водой." },
    { id: "karst-rain", topic: "karst", title: "После осадков", prompt: "Что нужно проверить после продолжительного дождя?", answer: "Новые просадки, трещины и изменение стока воды.", explanation: "Осадки усиливают фильтрацию воды в массив." },
    { id: "karst-action", topic: "karst", title: "Безопасное действие", prompt: "Что делать при обнаружении новой просадки рядом с тропой?", answer: "Не приближаться, обозначить место и сообщить ответственному взрослому или службе.", explanation: "Край просадки может быть неустойчивым." },
    { id: "karst-monitor", topic: "karst", title: "Наблюдение", prompt: "Какие изменения полезно фиксировать при повторном осмотре?", answer: "Размер, глубину, трещины и появление воды.", explanation: "Сравнение наблюдений показывает развитие процесса." },
  ],
  landslide: [
    { id: "slide-crack", topic: "landslide", title: "Трещина у склона", prompt: "Почему новая трещина на дороге может быть признаком оползня?", answer: "Она может показывать смещение грунта.", explanation: "Движущаяся масса разрывает покрытие и коммуникации." },
    { id: "slide-tree", topic: "landslide", title: "Наклон деревьев", prompt: "О чём говорит группа недавно наклонившихся деревьев?", answer: "О возможном постепенном движении грунта.", explanation: "Корни смещаются вместе с оползневым телом." },
    { id: "slide-water", topic: "landslide", title: "Выход воды", prompt: "Почему вода из склона требует внимания?", answer: "Переувлажнение снижает устойчивость грунта.", explanation: "Вода увеличивает массу и уменьшает сопротивление сдвигу." },
    { id: "slide-rain", topic: "landslide", title: "Сильный дождь", prompt: "Когда осматривать склон особенно важно?", answer: "После сильных или продолжительных осадков.", explanation: "Именно тогда могут появиться новые деформации." },
    { id: "slide-safe", topic: "landslide", title: "Безопасный маршрут", prompt: "Можно ли пересекать участок с новыми трещинами?", answer: "Нет, участок нужно обойти и сообщить о признаках.", explanation: "Скорость движения грунта трудно оценить без специалистов." },
    { id: "slide-record", topic: "landslide", title: "Фиксация", prompt: "Что важно записать при наблюдении?", answer: "Место, время, осадки и заметные изменения.", explanation: "Контекст помогает сравнивать состояние склона." },
  ],
  rockfall: [
    { id: "rock-fresh", topic: "rockfall", title: "Свежие обломки", prompt: "Что означает свежая осыпь у подножия стены?", answer: "На склоне продолжается отделение обломков.", explanation: "Свежий материал указывает на недавнюю активность." },
    { id: "rock-cracks", topic: "rockfall", title: "Раскрытые трещины", prompt: "Какой признак показывает готовый отделиться блок?", answer: "Раскрытые трещины вокруг блока.", explanation: "Они уменьшают связь блока с массивом." },
    { id: "rock-freeze", topic: "rockfall", title: "Замерзание воды", prompt: "Почему переход температуры через ноль опасен?", answer: "Замерзающая вода расширяет трещины.", explanation: "Повторные циклы ослабляют скальную породу." },
    { id: "rock-distance", topic: "rockfall", title: "Безопасная дистанция", prompt: "Где нельзя останавливаться для отдыха?", answer: "Под нависающими блоками и активной осыпью.", explanation: "Траекторию падения камня невозможно точно предсказать." },
    { id: "rock-report", topic: "rockfall", title: "Сообщение", prompt: "Что передать ответственному при обнаружении опасной зоны?", answer: "Точное место, видимые признаки и безопасно сделанное фото.", explanation: "Эти сведения помогают быстро проверить участок." },
    { id: "rock-weather", topic: "rockfall", title: "Погодный фактор", prompt: "После какой погоды риск может вырасти?", answer: "После ливня, оттепели или резкого похолодания.", explanation: "Вода и температурные изменения воздействуют на трещины." },
  ],
  protection: [
    { id: "protect-net", topic: "protection", title: "Покровная сетка", prompt: "Для чего используют сетку на скальном склоне?", answer: "Чтобы удерживать и направлять небольшие обломки.", explanation: "Сетка не устраняет источник, но снижает риск для людей внизу." },
    { id: "protect-ditch", topic: "protection", title: "Улавливающая траншея", prompt: "Что делает траншея у подножия склона?", answer: "Задерживает скатившиеся камни и осыпной материал.", explanation: "Свободное пространство принимает падающие обломки." },
    { id: "protect-drain", topic: "protection", title: "Дренаж", prompt: "Как дренаж помогает устойчивости?", answer: "Отводит лишнюю воду из грунта.", explanation: "Снижение переувлажнения уменьшает вероятность смещения." },
    { id: "protect-gabion", topic: "protection", title: "Габионы", prompt: "Где полезны габионы?", answer: "Для укрепления основания склона и защиты от размыва.", explanation: "Каменное заполнение удерживает грунт и пропускает воду." },
    { id: "protect-monitor", topic: "protection", title: "Защита и наблюдение", prompt: "Можно ли после установки защиты прекратить наблюдение?", answer: "Нет, состояние склона и сооружений нужно проверять.", explanation: "Защитные сооружения требуют обслуживания и контроля." },
    { id: "protect-choice", topic: "protection", title: "Выбор меры", prompt: "Почему нельзя ставить одну защиту на все участки?", answer: "Мера должна соответствовать типу процесса и условиям места.", explanation: "Обвал, осыпь и оползень требуют разных решений." },
  ],
};

export function buildPersonalRoute(form: ExpeditionForm): PersonalRoute {
  const candidates = taskBank[form.topic];
  const offset = form.difficulty === "beginner" ? 0 : form.difficulty === "medium" ? 1 : 2;
  const tasks = Array.from({ length: form.taskCount }, (_, index) => candidates[(index + offset) % candidates.length]);

  return {
    id: crypto.randomUUID(),
    learnerId: form.learnerId,
    form,
    tasks,
    createdAt: new Date().toISOString(),
  };
}
