import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { certificateCode, courseById, courseProgress, isEnrolled } from "@/lib/db";
import { categoryById } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { LearnLessons } from "@/components/learn-lessons";
import { Badge, Container } from "@/components/ui";
import { IconCertificate } from "@/components/icons";

export async function generateMetadata({
  params,
}: PageProps<"/courses/[id]/learn">): Promise<Metadata> {
  const { id } = await params;
  const course = courseById(id);
  if (!course) return { title: "Курс не найден" };
  return { title: `Обучение: ${course.title}`, description: "Модули курса и ваш прогресс" };
}

export default async function LearnPage({ params }: PageProps<"/courses/[id]/learn">) {
  const { id } = await params;
  const course = courseById(id);
  if (!course) notFound();

  const user = await getSessionUser();
  if (!user) redirect("/");
  if (!isEnrolled(user.id, id)) redirect(`/courses/${id}`);

  const progress = courseProgress(user.id, id)!;
  const cat = categoryById(course.categoryId);

  return (
    <div className="bg-grid">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-brand/15 blur-[130px]"
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
            <Link href={`/courses/${id}`} className="transition hover:text-white">
              {cat?.title}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-300">Обучение</span>
          </nav>

          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="brand" className="mb-3">
                <IconCertificate className="h-3.5 w-3.5" />
                Учебный модуль
              </Badge>
              <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-400">
                Проходите модули по порядку — за каждый начисляется XP, за полный курс — сертификат.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tabular-nums text-brand-light">{progress.pct}%</div>
              <div className="text-xs text-zinc-500">пройдено</div>
            </div>
          </div>

          <LearnLessons
            userName={user.name}
            courseId={course.id}
            courseTitle={course.title}
            syllabus={course.syllabus}
            initialCompleted={progress.completed}
            code={certificateCode(user.id, course.id)}
          />
        </Container>
      </section>
    </div>
  );
}
