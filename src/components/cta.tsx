import { config } from "@/lib/config";
import { Button, Container } from "./ui";
import { IconArrowRight } from "./icons";

/** Финальный CTA перед футером */
export function CTA() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="bg-grid relative overflow-hidden rounded-3xl border border-brand/25 bg-surface-2/80 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[560px] -translate-x-1/2 rounded-full bg-brand/25 blur-[110px]"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Готовы <span className="text-gradient">начать?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
              Присоединяйтесь к {config.city}-комьюнити: бесплатные курсы, митапы и хакатоны уже
              ждут. Первый шаг занимает меньше минуты.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/courses" size="lg">
                Выбрать курс
                <IconArrowRight className="h-5 w-5" />
              </Button>
              <a
                href={config.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full border border-white/15 px-7 text-base font-medium text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Telegram-сообщество
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
