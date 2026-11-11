"use client";

import { useEffect, useState } from "react";
import type { Hackathon } from "@/lib/data";
import { capacityPercent, formatDateRange, formatPrice } from "@/lib/utils";
import { Badge, Button, Card } from "./ui";
import { Countdown } from "./countdown";
import { IconPin, IconTrophy, IconUsers } from "./icons";

/** Список хакатонов (клиент: статусы по дате) */
export function HackathonsList({ hackathons }: { hackathons: Hackathon[] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only Date.now() после гидратации
    setNow(Date.now());
  }, []);

  return (
    <div className="space-y-6">
      {hackathons.map((h, i) => {
        const started = now !== null && new Date(h.startsAt).getTime() > now;
        const ended = now !== null && new Date(h.endsAt).getTime() < now;
        const pct = capacityPercent(h.seatsTaken, h.seatsTotal);
        const isNext = i === 0;

        return (
          <Card key={h.id} className={`overflow-hidden ${isNext ? "border-brand/30" : ""}`}>
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px]">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {isNext && !ended && <Badge tone="brand">Ближайший</Badge>}
                  {ended && <Badge tone="neutral">Завершён</Badge>}
                  <Badge tone="amber">
                    <IconTrophy className="h-3.5 w-3.5" />
                    {formatPrice(h.prizePool)}
                  </Badge>
                  <Badge tone="sky">
                    <IconPin className="h-3.5 w-3.5" />
                    {h.location}
                  </Badge>
                  {h.online && <Badge tone="neutral">+ онлайн-трек</Badge>}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-white">{h.title}</h2>
                <p className="mt-1.5 text-sm font-medium text-brand-light">{h.theme}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">{h.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {h.tracks.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Сайдбар карточки */}
              <div className="flex flex-col rounded-2xl border border-white/10 bg-surface p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Даты
                </div>
                <div className="mt-1 font-semibold text-white">
                  {formatDateRange(h.startsAt, h.endsAt)}
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <IconUsers className="h-3.5 w-3.5" />
                      {h.seatsTaken.toLocaleString("ru-RU")}/{h.seatsTotal.toLocaleString("ru-RU")} мест
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="mt-5 flex-1">
                  {!started && !ended && <Countdown target={h.startsAt} />}
                </div>

                <Button href="/#hackathons" className="mt-5 w-full" disabled={ended}>
                  {ended ? "Регистрация закрыта" : "Записаться"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
