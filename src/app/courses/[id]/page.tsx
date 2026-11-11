import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courseById, listCourses, isEnrolled } from "@/lib/db";
import { categoryById } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { formatDateTime, formatPrice, capacityPercent } from "@/lib/utils";
import { Badge, Button, Card, Container } from "@/components/ui";
import { CategoryIcon, IconCheck, IconClock, IconPin, IconStar, IconUsers } from "@/components/icons";
import { EnrollButton } from "@/components/enroll";
import { Countdown } from "@/components/countdown";

export async function generateMetadata({
  params,
}: PageProps<"/courses/[id]">): Promise<Metadata> {
  const { id } = await params;
  const course = courseById(id);
  if (!course) return { title: "Курс не найден" };
  return { title: course.title, description: course.short };
}

export default async function CoursePage({ params }: PageProps<"/courses/[id]">) {
  const { id } = await params;
  const course = courseById(id);
  if (!course) notFound();

  const cat = categoryById(course.categoryId);
  const all = listCourses();
  const related = all.filter((c) => c.categoryId === course.categoryId && c.id !== course.id).slice(0, 3);
  const pct = capacityPercent(course.seatsTaken, course.seatsTotal);

  const user = await getSessionUser();
  const enrolled = user ? isEnrolled(user.id, course.id) : false;

  return (
    <>
      {/* Шапка курса */}
      <section className="bg-grid relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-brand/15 blur-[130px]"
        />
        <Container className="relative py-12 sm:py-16">
          <nav className="mb-6 text-sm text-zinc-500">
            <Link href="/" className="transition hover:text-white">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <Link href="/courses" className="transition hover:text-white">
              Курсы
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-300">{cat?.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                {course.price === 0 ? (
                  <Badge tone="brand">Бесплатно</Badge>
                ) : (
                  <Badge tone="neutral">{formatPrice(course.price)}</Badge>
                )}
                {course.tag && <Badge tone="amber">{course.tag}</Badge>}
                <Badge tone="sky">{course.level}</Badge>
                <Badge>
                  <IconStar className="h-3 w-3 text-amber-300" />
                  {course.rating.toFixed(1)}
                </Badge>
              </div>

              <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-brand-light" />
                  {course.weeks} недель · {course.format}
                </span>
                <span className="inline-flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-brand-light" />
                  {course.students.toLocaleString("ru-RU")} студентов
                </span>
                <span className="inline-flex items-center gap-2">
                  <IconPin className="h-4 w-4 text-brand-light" />
                  {course.format === "Оффлайн" ? "Астана, главный хаб" : "Онлайн"}
                </span>
              </div>

              {/* Преподаватель */}
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-surface-2/60 p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-lg font-bold text-brand-light">
                  {course.instructor.name.charAt(0)}
                </span>
                <div>
                  <div className="font-semibold text-white">{course.instructor.name}</div>
                  <div className="text-sm text-zinc-500">{course.instructor.role}</div>
                </div>
              </div>

              {/* Программа */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-white">Программа курса</h2>
                <ol className="mt-5 space-y-3">
                  {course.syllabus.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-start gap-4 rounded-xl border border-white/8 bg-surface-2/40 px-4 py-3.5"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/15 font-mono text-xs font-bold text-brand-light">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Что получаете */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-white">Что вы получите</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Сертификат с кодом верификации",
                    "Доступ к материалам навсегда",
                    "Закрытое комьюнити выпускников",
                    "Обратная связь от ментора на проекте",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-light">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Сайдбар: запись */}
            <aside>
              <Card className="sticky top-24 p-6">
                <div className="text-3xl font-bold text-white">{formatPrice(course.price)}</div>
                <p className="mt-1 text-sm text-zinc-500">
                  {course.price === 0
                    ? "Бесплатно для всех. Нужен только аккаунт."
                    : "Оплата после записи, действует рассрочка 0-0-4."}
                </p>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Старт курса</span>
                    <span className="font-medium text-white">
                      {formatDateTime(course.startsAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Формат</span>
                    <span className="font-medium text-white">{course.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Продолжительность</span>
                    <span className="font-medium text-white">{course.weeks} недель</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-zinc-500">
                      Мест занято: {course.seatsTaken}/{course.seatsTotal}
                    </span>
                    <span className="text-zinc-500">{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <EnrollButton
                  courseId={course.id}
                  courseTitle={course.title}
                  initialEnrolled={enrolled}
                  size="lg"
                  className="mt-6"
                />
                <p className="mt-3 text-center text-xs text-zinc-600">
                  Отменить запись можно в любой момент
                </p>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    До старта
                  </div>
                  <Countdown target={course.startsAt} />
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </section>

      {/* Похожие курсы */}
      {related.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Ещё в «{cat?.title}»</h2>
              <Button href={`/courses?cat=${course.categoryId}`} variant="ghost" size="sm">
                Все курсы направления
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <Link key={c.id} href={`/courses/${c.id}`} className="group">
                  <Card className="flex h-full items-center gap-4 p-5 transition group-hover:border-brand/40">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat?.gradient ?? "from-white/5 to-transparent"}`}
                    >
                      {cat && <CategoryIcon name={cat.icon} className="h-6 w-6 text-white" />}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white group-hover:text-brand-light">
                        {c.title}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {c.weeks} нед. · {c.format} · {formatPrice(c.price)}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
