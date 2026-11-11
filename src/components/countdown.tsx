"use client";

import { useEffect, useState } from "react";

/** Обратный отсчёт до даты. SSR-safe: на сервере рендерит плейсхолдер. */
export function Countdown({ target, className = "" }: { target: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const targetMs = new Date(target).getTime();
  const diff = now === null ? null : Math.max(0, targetMs - now);

  const parts =
    diff === null
      ? null
      : {
          d: Math.floor(diff / 86_400_000),
          h: Math.floor((diff % 86_400_000) / 3_600_000),
          m: Math.floor((diff % 3_600_000) / 60_000),
          s: Math.floor((diff % 60_000) / 1000),
        };

  if (parts === null) {
    return (
      <div className={`flex gap-3 ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-[64px] w-16 items-center justify-center rounded-xl border border-white/10 bg-surface text-xl font-bold text-zinc-600 sm:h-[72px] sm:w-20"
          >
            —
          </div>
        ))}
      </div>
    );
  }

  if (diff === 0) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">
          Старт! Идёт регистрация
        </span>
      </div>
    );
  }

  const items = [
    { v: parts.d, l: "дней" },
    { v: parts.h, l: "часов" },
    { v: parts.m, l: "минут" },
    { v: parts.s, l: "секунд" },
  ];

  return (
    <div className={`flex gap-2 sm:gap-3 ${className}`}>
      {items.map((it) => (
        <div
          key={it.l}
          className="flex h-[64px] flex-1 flex-col items-center justify-center rounded-xl border border-white/10 bg-surface sm:h-[72px] sm:w-20 sm:flex-none"
        >
          <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {String(it.v).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">{it.l}</span>
        </div>
      ))}
    </div>
  );
}
