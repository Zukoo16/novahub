import { gamificationLevels, xpRules } from "./data";

export interface XpSummary {
  xp: number;
  levelIndex: number;
  levelTitle: string;
  currentMin: number;
  nextXp: number | null;
  nextTitle: string | null;
  progress: number; // 0..100 к следующему уровню
  lines: { label: string; xp: number }[];
}

const REGISTRATION_XP = 50;
const LESSON_XP = xpRules.find((r) => r.action === "Модуль курса")?.xp ?? 100;
const COURSE_XP = xpRules.find((r) => r.action === "Курс до конца")?.xp ?? 500;

/** Входные данные для расчёта XP */
export interface XpBreakdown {
  lessons: number; // пройденные модули курсов
  courses: number; // курсы, доведённые до конца
}

/**
 * Подсчёт XP пользователя (демо-логика):
 * 50 XP за регистрацию + 100 XP за каждый пройденный модуль + 500 XP за каждый
 * полностью пройденный курс.
 */
export function computeXp(b: XpBreakdown): XpSummary {
  const lines: { label: string; xp: number }[] = [
    { label: "Регистрация на платформе", xp: REGISTRATION_XP },
  ];
  if (b.lessons > 0) {
    lines.push({ label: `Пройдено модулей (${b.lessons})`, xp: b.lessons * LESSON_XP });
  }
  if (b.courses > 0) {
    lines.push({ label: `Курс до конца (${b.courses})`, xp: b.courses * COURSE_XP });
  }
  const xp = lines.reduce((s, l) => s + l.xp, 0);

  let levelIndex = 0;
  for (let i = 0; i < gamificationLevels.length; i++) {
    if (xp >= gamificationLevels[i].xp) levelIndex = i;
  }
  const current = gamificationLevels[levelIndex];
  const next = gamificationLevels[levelIndex + 1] ?? null;
  const span = next ? next.xp - current.xp : 0;
  const progress = next ? Math.min(100, Math.round(((xp - current.xp) / span) * 100)) : 100;

  return {
    xp,
    levelIndex,
    levelTitle: current.title,
    currentMin: current.xp,
    nextXp: next ? next.xp : null,
    nextTitle: next ? next.title : null,
    progress,
    lines,
  };
}
