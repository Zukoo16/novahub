import Link from "next/link";
import { listHackathons } from "@/lib/db";
import type { Hackathon } from "@/lib/data";
import { capacityPercent, formatDateRange, formatPrice } from "@/lib/utils";
import { Badge, Button, Card, Container, SectionHeading } from "./ui";
import { Countdown } from "./countdown";
import { IconPin, IconTrophy, IconUsers } from "./icons";

/** Секция хакатонов на главной (серверный компонент): ближайший крупно + список остальных */
function pickNext(sorted: Hackathon[]) {
  const now = Date.now();
  return sorted.find((h) => new Date(h.endsAt).getTime() > now) ?? sorted[0];
}

export function HackathonsSection() {
  const sorted = [...listHackathons()].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  const next = pickNext(sorted);
  const rest = sorted.filter((h) => h.id !== next.id);

  return (
    <section id="hackathons" className="scroll-mt-20 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Хакатоны"
          title="Соревнуйся, построй продукт, забери приз"
          subtitle="Субботы и воскресенья, которые меняют карьеру. ИИ-судья, живое жюри и призовые фонды."
        />

        {/* Ближайший хакатон */}
        <Card className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/15 via-transparent to-transparent"
          />
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="brand">
                  <IconTrophy className="h-3.5 w-3.5" />
                  Призовой фонд {formatPrice(next.prizePool)}
                </Badge>
                <Badge tone="sky">
                  <IconPin className="h-3.5 w-3.5" />
                  {next.location}
                </Badge>
                {next.online && <Badge tone="neutral">+ онлайн</Badge>}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{next.title}</h3>
              <p className="mt-2 text-sm font-medium text-brand-light">{next.theme}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">{next.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {next.tracks.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Countdown target={next.startsAt} className="max-w-md" />
                <div className="sm:ml-auto sm:text-right">
                  <div className="mb-2 flex items-center justify-between gap-6 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <IconUsers className="h-3.5 w-3.5" />
                      {next.seatsTaken.toLocaleString("ru-RU")} / {next.seatsTotal.toLocaleString("ru-RU")} мест
                    </span>
                  </div>
                  <div className="mb-4 h-1.5 w-48 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${capacityPercent(next.seatsTaken, next.seatsTotal)}%` }}
                    />
                  </div>
                  <Button href="/hackathons">Записаться</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Остальные */}
        {rest.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rest.map((h) => (
              <Link key={h.id} href="/hackathons" className="group">
                <Card className="flex h-full items-center justify-between gap-4 p-5 transition-all group-hover:border-brand/40">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-white group-hover:text-brand-light">
                      {h.title}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">
                      {formatDateRange(h.startsAt, h.endsAt)} · {h.location}
                    </div>
                    <div className="mt-2 text-xs text-zinc-600">
                      Призовой фонд {formatPrice(h.prizePool)}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition group-hover:border-brand/40 group-hover:text-brand-light">
                    Регистрация →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
