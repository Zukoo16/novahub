import type { Metadata } from "next";
import { config } from "@/lib/config";
import { Card, Container, SectionHeading, Button } from "@/components/ui";
import { IconArrowRight, IconCheck, IconGlobe, IconSpark, IconTrophy, IconUsers } from "@/components/icons";

export const metadata: Metadata = {
  title: "О платформе",
  description: "NovaHub — образовательная платформа: курсы, хакатоны и комьюнити по ИИ и цифровым профессиям.",
};

const values = [
  {
    icon: IconSpark,
    title: "Практика вместо теории",
    text: "80% курса — практика. Каждый модуль заканчивается задачей, каждый курс — проектом в портфолио.",
  },
  {
    icon: IconUsers,
    title: "Комьюнити",
    text: "Закрытые чаты курсов, митапы каждую неделю и нетворкинг с инженерами индустрии.",
  },
  {
    icon: IconTrophy,
    title: "Хакатоны как тренажёр",
    text: "Хакатон — это спринт на 36 часов: вы учитесь быстрее, чем за год лекций.",
  },
  {
    icon: IconGlobe,
    title: "Открытость",
    text: "Бесплатные курсы и митапы. Платные форматы — только там, где нужен плотный менторинг.",
  },
];

const faq = [
  {
    q: "Нужен ли опыт, чтобы записаться?",
    a: "Для курсов начального уровня — нет. Мы даём список подготовки и бесплатные вводные материалы до старта.",
  },
  {
    q: "Что такое демо-режим записи?",
    a: "Этот сайт — демо: данные (курсы, участники, запись) хранятся локально в вашем браузере. В боевой версии запись идёт через аккаунт и оплату.",
  },
  {
    q: "Выдаёте ли вы сертификаты?",
    a: "Да. По завершении курса — электронный сертификат с кодом верификации, по запросу — бумажный.",
  },
  {
    q: "Можно ли учиться удалённо?",
    a: "Курсы онлайн доступны из любой страны. Оффлайн-курсы проходят в Астане, часть занятий транслируется.",
  },
  {
    q: "Как стать ментором или спикером?",
    a: "Напишите на " + config.email + " с темой — мы откликаемся в течение недели.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-grid relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]"
        />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
              О платформе
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {config.tagline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              {config.name} — образовательная платформа для тех, кто строит цифровое будущее:
              курсы по ИИ, стартапам, данным и разработке, хакатоны с реальными задачами
              бизнеса и живое комьюнити в {config.city}.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Принципы" title="На чём мы стоим" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <Card key={v.title} className="p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-light">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{v.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 bg-surface/40 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Частые вопросы" />
          <div className="grid gap-4 lg:grid-cols-2">
            {faq.map((f) => (
              <Card key={f.q} className="p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-light">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{f.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-brand/25 bg-surface-2/60 p-10 text-center">
            <h2 className="text-2xl font-bold text-white">Есть вопросы?</h2>
            <p className="max-w-md text-sm text-zinc-400">
              Пишите на {config.email} — отвечаем в течение одного рабочего дня.
            </p>
            <Button href="/courses">
              Смотреть курсы
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
