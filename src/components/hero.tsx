import { Button, Container } from "./ui";
import { IconArrowRight, IconTrophy } from "./icons";
import { listHackathons } from "@/lib/db";
import { Countdown } from "./countdown";

/** Ближайший хакатон (страница динамическая — Date.now() допустим) */
function nextHackathon() {
  const now = Date.now();
  const sorted = [...listHackathons()].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  return sorted.find((h) => new Date(h.endsAt).getTime() > now) ?? sorted[0];
}

/** Hero-секция (серверный компонент) */
export function Hero() {
  const hack = nextHackathon();

  return (
    <section className="bg-grid relative overflow-hidden">
      {/* Свечение */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-120px] top-1/3 h-72 w-72 rounded-full bg-lime/10 blur-[120px]"
      />

      <Container className="relative flex flex-col items-center pb-20 pt-20 text-center sm:pb-28 sm:pt-28">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand-light">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-light" />
            </span>
            Регистрация на «{hack.title}» открыта
          </span>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Развиваем людей,
            <br />
            которые <span className="text-gradient">создают будущее</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Курсы, хакатоны с ИИ-судьёй и живые митапы. Учитесь тому, что двигает индустрию
            вперёд: ИИ, стартапы, данные, no-code и разработка.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/courses" size="lg">
              Смотреть курсы
              <IconArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/hackathons" variant="outline" size="lg">
              <IconTrophy className="h-5 w-5 text-brand-light" />
              Хакатоны
            </Button>
          </div>

          {/* Countdown до ближайшего хакатона */}
          <div className="mx-auto mt-14 w-full max-w-lg rounded-2xl border border-white/10 bg-surface-2/70 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 text-left">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Ближайший хакатон
                </div>
                <div className="mt-1 truncate font-semibold text-white">{hack.title}</div>
              </div>
              <a
                href="/hackathons"
                className="hidden shrink-0 rounded-full bg-brand/15 px-4 py-2 text-xs font-semibold text-brand-light transition hover:bg-brand/25 sm:block"
              >
                Регистрация
              </a>
            </div>
            <div className="mt-4">
              <Countdown target={hack.startsAt} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
