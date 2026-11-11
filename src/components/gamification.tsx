import { gamificationLevels, xpRules } from "@/lib/data";
import { Badge, Card, Container, SectionHeading } from "./ui";
import { IconZap } from "./icons";

/** Секция геймификации: уровни + как получают XP */
export function Gamification() {
  return (
    <section id="gamification" className="scroll-mt-20 border-t border-white/5 bg-surface/40 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Геймификация"
          title="Колируйте знания — получайте привилегии"
          subtitle="XP начисляется за модули, курсы, митапы и хакатоны. Уровни открывают скидки, приоритетную запись и менторов."
        />

        <div className="grid gap-4 md:grid-cols-5">
          {gamificationLevels.map((lvl, i) => (
            <Card
              key={lvl.title}
              className={`relative flex h-full flex-col p-5 ${
                i === 2 ? "border-brand/40 bg-brand/8" : ""
              }`}
            >
              {i === 2 && (
                <span className="absolute -top-2.5 left-5 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Популярный
                </span>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Уровень {i + 1}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-brand-light">
                  <IconZap className="h-3 w-3" />
                  {lvl.xp.toLocaleString("ru-RU")} XP
                </span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-white">{lvl.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{lvl.perks}</p>
            </Card>
          ))}
        </div>

        {/* Как получают XP */}
        <div className="mt-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Как получают очки
          </h3>
          <div className="flex flex-wrap gap-3">
            {xpRules.map((r) => (
              <div
                key={r.action}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface-2/60 px-4 py-3"
              >
                <Badge tone="brand">+{r.xp} XP</Badge>
                <span className="text-sm text-zinc-300">{r.action}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
