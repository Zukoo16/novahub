import Link from "next/link";
import type { Course } from "@/lib/data";
import { categoryById } from "@/lib/data";
import { formatPrice, capacityPercent } from "@/lib/utils";
import { Badge, Card } from "./ui";
import { CategoryIcon, IconClock, IconStar, IconUsers } from "./icons";

/** Карточка курса (клики ведут на страницу курса) */
export function CourseCard({ course }: { course: Course }) {
  const cat = categoryById(course.categoryId);
  const pct = capacityPercent(course.seatsTaken, course.seatsTotal);
  const almostFull = pct >= 90;

  return (
    <Link href={`/courses/${course.id}`} className="group flex h-full flex-col">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand/40">
        {/* Обложка: градиент + иконка категории */}
        <div
          className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${cat?.gradient ?? "from-white/5 to-transparent"}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-2xl text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            {cat && <CategoryIcon name={cat.icon} className="h-7 w-7" />}
          </span>
          <div className="absolute left-3 top-3 flex gap-2">
            {course.price === 0 && <Badge tone="brand">Бесплатно</Badge>}
            {course.tag && <Badge tone="amber">{course.tag}</Badge>}
          </div>
          <div className="absolute right-3 top-3">
            <Badge>
              <IconStar className="h-3 w-3 text-amber-300" />
              {course.rating.toFixed(1)}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-brand-light">
            {cat?.title}
          </div>
          <h3 className="mt-2 text-base font-semibold leading-snug text-white group-hover:text-brand-light">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{course.short}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <IconClock className="h-3.5 w-3.5" />
              {course.weeks} нед. · {course.format}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconUsers className="h-3.5 w-3.5" />
              {course.students.toLocaleString("ru-RU")}
            </span>
          </div>

          <div className="mt-auto pt-5">
            {/* Прогресс заполнения мест */}
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className={almostFull ? "text-amber-300" : "text-zinc-500"}>
                {almostFull ? `Осталось ${course.seatsTotal - course.seatsTaken} мест` : "Запись открыта"}
              </span>
              <span className="text-zinc-500">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
              <div
                className={`h-full rounded-full ${almostFull ? "bg-amber-400" : "bg-brand"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-base font-bold text-white">{formatPrice(course.price)}</span>
              <span className="text-xs font-medium text-brand-light opacity-0 transition-opacity group-hover:opacity-100">
                Подробнее →
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
