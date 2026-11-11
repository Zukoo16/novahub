import { listCourses } from "@/lib/db";
import { CourseCard } from "./course-card";
import { Button, Container, SectionHeading } from "./ui";
import { IconArrowRight } from "./icons";

/** Секция «Популярные курсы» на главной (серверный компонент) */
export function FeaturedCourses() {
  const featured = [...listCourses()].sort((a, b) => b.students - a.students).slice(0, 6);

  return (
    <section className="border-t border-white/5 bg-surface/40 py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Курсы"
            title="С чего начать прямо сейчас"
            subtitle="Топ курсов по числу студентов. Бесплатные и платные форматы, онлайн и оффлайн."
          />
          <Button href="/courses" variant="outline" className="mb-10 shrink-0">
            Все курсы
            <IconArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}
