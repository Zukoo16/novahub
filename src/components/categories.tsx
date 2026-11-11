import Link from "next/link";
import { categories } from "@/lib/data";
import { listCourses } from "@/lib/db";
import { CategoryIcon } from "./icons";
import { Container, SectionHeading, Card } from "./ui";

export function Categories() {
  // Реальные счётчики курсов из БД
  const counts: Record<string, number> = {};
  for (const c of listCourses()) {
    counts[c.categoryId] = (counts[c.categoryId] ?? 0) + 1;
  }

  return (
    <section id="categories" className="scroll-mt-20 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Направления"
          title="Учитесь тому, что двигает индустрию вперёд"
          subtitle="Шесть направлений — от ИИ до кибербезопасности. Выбирайте трек и двигайтесь к цели."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/courses?cat=${cat.id}`} className="group">
              <Card className="relative h-full overflow-hidden p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand/40">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-surface-3 text-brand-light">
                    <CategoryIcon name={cat.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{cat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{cat.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      {counts[cat.id] ?? 0} {pluralCategories(counts[cat.id] ?? 0)}
                    </span>
                    <span className="font-medium text-brand-light opacity-0 transition-opacity group-hover:opacity-100">
                      Смотреть →
                    </span>
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

function pluralCategories(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "курс";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "курса";
  return "курсов";
}
