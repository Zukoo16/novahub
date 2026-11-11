import Link from "next/link";
import { listEvents } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { Badge, Card, Container, SectionHeading } from "./ui";
import { IconCalendar, IconPin } from "./icons";

const kindTone: Record<string, "brand" | "sky" | "amber" | "rose" | "neutral"> = {
  "Митап": "brand",
  "Воркшоп": "sky",
  "Демо-день": "amber",
  "Лекция": "neutral",
};

/** Секция мероприятий на главной (серверный компонент) */
export function EventsSection() {
  const events = listEvents();
  return (
    <section className="border-t border-white/5 bg-surface/40 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Мероприятия"
          title="Живые митапы и воркшопы"
          subtitle="Каждую неделю — встречи с практиками, разборы проектов и нетворкинг."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((ev) => (
            <Link key={ev.id} href="/events" className="group">
              <Card className="flex h-full gap-4 p-5 transition-all group-hover:border-brand/40">
                {/* Дата */}
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-surface-3">
                  <IconCalendar className="h-4 w-4 text-brand-light" />
                  <span className="mt-1 text-xs font-semibold text-white">
                    {formatDateTime(ev.startsAt).split(",")[0]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={kindTone[ev.kind] ?? "neutral"}>{ev.kind}</Badge>
                    {ev.free ? <Badge tone="brand">Бесплатно</Badge> : <Badge tone="amber">Платное</Badge>}
                  </div>
                  <h3 className="mt-2.5 font-semibold leading-snug text-white group-hover:text-brand-light">
                    {ev.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {ev.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <IconPin className="h-3.5 w-3.5" />
                      {ev.location}
                    </span>
                    <span>·</span>
                    <span>{formatDateTime(ev.startsAt)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
