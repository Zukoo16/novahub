import { Badge, Card, Container, SectionHeading } from "./ui";
import { IconCertificate, IconCheck } from "./icons";

const features = [
  {
    title: "Электронный и бумажный",
    text: "Получаете сертификат сразу после защиты проекта — в PDF и по запросу на бумаге.",
  },
  {
    title: "Проверка по коду",
    text: "Уникальный код верификации: работодатель подтверждает подлинность за секунды.",
  },
  {
    title: "Признание партнёрами",
    text: "60+ компаний-партнёров учитывают наши сертификаты при найме и повышениях.",
  },
];

/** Секция про сертификаты */
export function Certificate() {
  return (
    <section id="certificate" className="scroll-mt-20 py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Сертификаты"
              title="Подтвердите навыки документом"
              subtitle="Каждый завершённый курс и победный хакатон заканчиваются сертификатом, который принимают работодатели."
            />
            <ul className="space-y-5">
              {features.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-light">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-semibold text-white">{f.title}</div>
                    <div className="mt-1 text-sm leading-relaxed text-zinc-400">{f.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Макет сертификата */}
          <div className="animate-float-slow">
            <Card className="relative mx-auto max-w-md overflow-hidden p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/20 blur-3xl"
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <Badge tone="brand">
                    <IconCertificate className="h-3.5 w-3.5" />
                    Сертификат
                  </Badge>
                  <span className="font-mono text-xs text-zinc-500">NVH-2026-0847</span>
                </div>
                <div className="mt-8 text-center">
                  <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Настоящим подтверждается, что
                  </div>
                  <div className="mt-3 text-2xl font-bold text-gradient">Адам Нурланов</div>
                  <div className="mx-auto mt-5 h-px w-24 bg-white/15" />
                  <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                    успешно завершил курс
                  </p>
                  <div className="mt-2 font-semibold text-white">
                    «LLM и агентные системы с нуля»
                  </div>
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-4 text-xs text-zinc-500">
                  <span>Начал: 01.12.2026</span>
                  <span>Окончил: 12.01.2027</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
