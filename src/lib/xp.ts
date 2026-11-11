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

/**
 * Подсчёт XP пользователя по его записям (демо-логика).
 * enrollments — количество пройденных/записанных курсов.
 */
export function computeXp(enrollments: number): XpSummary {
  const lines = [
    { label: "Регистрация на платформе", xp: 50 },
    ...Array.from({ length: enrollments }, () => ({
      label: "Курс до конца",
      xp: xpRules.find((r) => r.action === "Курс до конца")?.xp ?? 500,
    })),
  ];
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
