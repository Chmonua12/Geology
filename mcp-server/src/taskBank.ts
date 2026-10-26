import type { ExpeditionForm, PersonalRoute, Topic } from "./contracts";

const gameScreens: Record<Topic, { screenId: string; title: string; gameType: string }> = {
  karst: {
    screenId: "screen-lago",
    title: "Лаго-Наки: карстовая опасность",
    gameType: "Поиск опасных признаков на панораме",
  },
  landslide: {
    screenId: "screen-kamennomostsky",
    title: "Каменномостский: признаки оползня",
    gameType: "Поиск признаков движения склона",
  },
  rockfall: {
    screenId: "screen-fisht-hadzhokh",
    title: "Фишт и Хаджох: обвалы и осыпи",
    gameType: "Выбор наблюдения и инженерной защиты",
  },
  protection: {
    screenId: "screen-protection-flight",
    title: "Инженерная защита склонов",
    gameType: "Flappy-игра со сбором защитных сооружений",
  },
};

export function buildPersonalRoute(form: ExpeditionForm): PersonalRoute {
  const id = crypto.randomUUID();
  const screen = gameScreens[form.topic];
  const appUrl = process.env.GEOLOGY_APP_URL || "http://127.0.0.1:8000/";
  const query = new URLSearchParams({
    personal: "1",
    route: id,
    learner: form.learnerId,
    topic: form.topic,
    difficulty: form.difficulty,
    hintMode: form.hintMode,
  });

  return {
    id,
    learnerId: form.learnerId,
    form,
    screenId: screen.screenId,
    title: screen.title,
    gameType: screen.gameType,
    launchUrl: `${appUrl}?${query.toString()}`,
    createdAt: new Date().toISOString(),
  };
}
