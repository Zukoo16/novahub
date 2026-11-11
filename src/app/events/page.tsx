import type { Metadata } from "next";
import { config } from "@/lib/config";
import { listEvents } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { Badge, Card, Container, SectionHeading } from "@/components/ui";
import { IconCalendar, IconPin, IconUsers } from "@/components/icons";

export const metadata: Metadata = {
  title: "Мероприятия",
  description: "Митапы, воркшопы, лекции и демо-дни платформы в Астане и онлайн.",
};

const kindTone: Record<string, "brand" | "sky" | "amber" | "neutral"> = {
  Митап: "brand",
  Воркшоп: "sky",
  "Демо-день": "amber",
  Лекция: "neutral",
};

export default function EventsPage() {
  const events = listEvents();
  return (
    <div className="bg-grid">
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Мероприятия"
            title="Митапы, воркшопы и демо-дни"
            subtitle="Большинство мероприятий бесплатные. Регистрация — по ссылке в Telegram-сообществе или прямо на площадке."
          />

          <div className="space-y-4">
            {events.map((ev) => (
              <Card key={ev.id} className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-5 sm:w-64 sm:flex-col sm:items-start sm:gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <IconCalendar className="h-4 w-4 text-brand-light" />
                    {formatDateTime(ev.startsAt)}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-zinc-500">
                    <IconPin className="h-4 w-4" />
                    {ev.location}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={kindTone[ev.kind] ?? "neutral"}>{ev.kind}</Badge>
                    {ev.free ? (
                      <Badge tone="brand">Бесплатно</Badge>
                    ) : (
                      <Badge tone="amber">Платное</Badge>
                    )}
                  </div>
                  <h2 className="mt-2.5 text-lg font-semibold text-white">{ev.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{ev.description}</p>
                  {ev.speaker && (
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-zinc-500">
                      <IconUsers className="h-3.5 w-3.5" />
                      {ev.speaker}
                    </div>
                  )}
                </div>

                <a
                  href={config.socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-white transition hover:border-brand hover:text-brand-light"
                >
                  {ev.free ? "Участие" : "Купить билет"}
                </a>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-surface-2/60 p-6 text-sm leading-relaxed text-zinc-400">
            <span className="font-semibold text-white">Хотите выступить?</span> Спикеры ищутся
            постоянно: присылайте тему доклада в Telegram — лучшие получат билеты на все
            мероприятия квартала и запись в студии.
          </div>
        </Container>
      </section>
    </div>
  );
}
