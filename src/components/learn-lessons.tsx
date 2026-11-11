"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { xpRules } from "@/lib/data";
import { Badge, Button, Card } from "./ui";
import { IconCertificate, IconCheck, IconPlay, IconZap } from "./icons";

const LESSON_XP = xpRules.find((r) => r.action === "Модуль курса")?.xp ?? 100;
const COURSE_XP = xpRules.find((r) => r.action === "Курс до конца")?.xp ?? 500;

/**
 * Учебный экран курса: список модулей с отметкой «пройден»,
 * прогресс-бар и сертификат при 100%.
 */
export function LearnLessons({
  userName,
  courseId,
  courseTitle,
  syllabus,
  initialCompleted,
  code,
}: {
  userName: string;
  courseId: string;
  courseTitle: string;
  syllabus: string[];
  initialCompleted: number[];
  code: string;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<number>>(() => new Set(initialCompleted));
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");

  const total = syllabus.length;
  const doneCount = completed.size;
  const pct = total ? Math.min(100, Math.round((doneCount / total) * 100)) : 0;
  const allDone = total > 0 && doneCount >= total;

  const toggle = async (i: number) => {
    if (busy !== null) return;
    setBusy(i);
    setError("");
    try {
      const res = await fetch(`/api/courses/${courseId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonIndex: i }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Не удалось отметить урок");
        return;
      }
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(i);
        return next;
      });
      router.refresh();
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Прогресс */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Ваш прогресс
            </div>
            <div className="mt-1 text-2xl font-bold text-white">
              {pct}%
              <span className="ml-2 text-sm font-normal text-zinc-500">
                {doneCount} из {total} модулей
              </span>
            </div>
          </div>
          {allDone ? (
            <Badge tone="brand">
              <IconCertificate className="h-3.5 w-3.5" />
              Курс завершён
            </Badge>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400">
              <IconZap className="h-3.5 w-3.5 text-brand-light" />
              +{LESSON_XP} XP за модуль
            </span>
          )}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-brand transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
      </Card>

      {/* Сертификат при 100% */}
      {allDone && (
        <Card className="relative overflow-hidden p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/25 blur-3xl"
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <Badge tone="brand">
                <IconCertificate className="h-3.5 w-3.5" />
                Сертификат
              </Badge>
              <span className="font-mono text-xs text-zinc-500">{code}</span>
            </div>
            <div className="mt-8 text-center">
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Настоящим подтверждается, что
              </div>
              <div className="mt-3 text-2xl font-bold text-gradient">{userName}</div>
              <div className="mx-auto mt-5 h-px w-24 bg-white/15" />
              <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                успешно завершил(а) курс
              </p>
              <div className="mt-2 font-semibold text-white">«{courseTitle}»</div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-zinc-500">
              <span>
                Код верификации: <span className="font-mono text-zinc-300">{code}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-brand-light">
                <IconZap className="h-3.5 w-3.5" />
                +{COURSE_XP} XP начислено
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Список модулей */}
      <ol className="space-y-3">
        {syllabus.map((item, i) => {
          const isDone = completed.has(i);
          const isBusy = busy === i;
          return (
            <li
              key={i}
              className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-4 transition-colors ${
                isDone ? "border-brand/30 bg-brand/8" : "border-white/8 bg-surface-2/40"
              }`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                    isDone ? "bg-brand text-white" : "bg-white/8 text-zinc-400"
                  }`}
                >
                  {isDone ? <IconCheck className="h-4 w-4" /> : i + 1}
                </span>
                <div className="min-w-0">
                  <div className={`text-sm font-medium ${isDone ? "text-zinc-400" : "text-zinc-200"}`}>
                    {item}
                  </div>
                  {!isDone && (
                    <div className="mt-0.5 text-[11px] text-zinc-500">Модуль {i + 1} из {total}</div>
                  )}
                </div>
              </div>
              <Button
                variant={isDone ? "outline" : "primary"}
                size="sm"
                disabled={isBusy || isDone}
                onClick={() => void toggle(i)}
                className="shrink-0"
              >
                {isBusy ? (
                  "Сохраняем…"
                ) : isDone ? (
                  <>
                    <IconCheck className="h-4 w-4 text-brand-light" />
                    Пройден
                  </>
                ) : (
                  <>
                    <IconPlay className="h-4 w-4" />
                    Пройти модуль
                  </>
                )}
              </Button>
            </li>
          );
        })}
      </ol>

      <p className="text-center text-xs text-zinc-600">
        Модули отмечаются по порядку и не снимаются. Пройдите все, чтобы получить сертификат.
      </p>
    </div>
  );
}
