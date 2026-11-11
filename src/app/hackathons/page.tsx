import type { Metadata } from "next";
import { listHackathons } from "@/lib/db";
import { HackathonsList } from "@/components/hackathons-list";
import { Card, Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Хакатоны",
  description:
    "Хакатоны платформы: ИИ-судья, живое жюри, призовые фонды. Астана, Алматы и онлайн.",
};

const steps = [
  { n: "01", t: "Регистрация", d: "Собирайте команду до 4 человек и подавайте заявку." },
  { n: "02", t: "Старт и питчи", d: "Утром — открытие, темы и питч идеи перед менторами." },
  { n: "03", t: "36 часов разработки", d: "Менторы, API партнёров и поддержка 24/7 на площадке." },
  { n: "04", t: "Демо и награждение", d: "Демо перед жюри, ИИ-оценка кода и вручение призов." },
];

export default function HackathonsPage() {
  const hackathons = listHackathons();
  return (
    <div className="bg-grid">
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Хакатоны"
            title="Соревнуйся, построй продукт, забери приз"
            subtitle="Формат: 36 часов, команды до 4 человек. Места ограничены — вход first come, first served."
          />

          <HackathonsList hackathons={hackathons} />

          {/* Как проходит */}
          <div className="mt-14">
            <h2 className="mb-6 text-xl font-bold text-white">Как проходит хакатон</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <Card key={s.n} className="p-5">
                  <div className="font-mono text-sm font-bold text-brand-light">{s.n}</div>
                  <div className="mt-2 font-semibold text-white">{s.t}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{s.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
