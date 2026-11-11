"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { categories, type Course } from "@/lib/data";
import { CourseCard } from "./course-card";
import { Container, SectionHeading, Badge } from "./ui";
import { IconSearch, IconX } from "./icons-search";

/** Читает ?cat= из URL на клиенте (после маунта) */
function readCatFromUrl(): string {
  if (typeof window === "undefined") return "all";
  const cat = new URLSearchParams(window.location.search).get("cat");
  return cat && categories.some((c) => c.id === cat) ? cat : "all";
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition ${
        active
          ? "border-brand bg-brand/15 text-brand-light"
          : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function CatalogInner({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [level, setLevel] = useState<string>("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Применяем ?cat= из URL после гидратации
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- одноразовое чтение URL-параметра после гидратации
    setCat(readCatFromUrl());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (cat !== "all" && c.categoryId !== cat) return false;
      if (level !== "all" && c.level !== level) return false;
      if (freeOnly && c.price !== 0) return false;
      if (q) {
        const catTitle = categories.find((x) => x.id === c.categoryId)?.title ?? "";
        if (!`${c.title} ${c.short} ${catTitle}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [courses, query, cat, level, freeOnly]);

  const levels = ["Начальный", "Средний", "Продвинутый"];

  const applyCat = (id: string) => startTransition(() => setCat(id));

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Каталог"
          title="Курсы"
          subtitle="Ищите по названию, фильтруйте по направлению и уровню."
        />

        {/* Поиск */}
        <div className="relative mb-5 max-w-xl">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти курс: LLM, MVP, дашборды…"
            className="h-12 w-full rounded-2xl border border-white/10 bg-surface-2 pl-11 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-brand"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 hover:text-white"
              aria-label="Сбросить поиск"
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Фильтры */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={cat === "all"} onClick={() => applyCat("all")}>
            Все направления
          </Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => applyCat(c.id)}>
              {c.title}
            </Chip>
          ))}
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Chip active={level === "all"} onClick={() => setLevel("all")}>
            Любой уровень
          </Chip>
          {levels.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l}
            </Chip>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          <Chip active={freeOnly} onClick={() => setFreeOnly((v) => !v)}>
            Только бесплатные
          </Chip>
        </div>

        {/* Счётчик + состояние */}
        <div className="mb-6 flex items-center gap-3">
          <Badge tone={isPending ? "amber" : "brand"}>
            {filtered.length} {plural(filtered.length)}
          </Badge>
          {cat !== "all" && (
            <span className="text-sm text-zinc-500">
              направление: {categories.find((c) => c.id === cat)?.title}
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center">
            <div className="text-lg font-semibold text-white">Ничего не найдено</div>
            <p className="mt-2 text-sm text-zinc-500">
              Попробуйте убрать часть фильтров или изменить запрос.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCat("all");
                setLevel("all");
                setFreeOnly(false);
              }}
              className="mt-5 rounded-full border border-white/15 px-5 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}>
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function plural(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "курс";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "курса";
  return "курсов";
}

export function CourseCatalog({ courses }: { courses: Course[] }) {
  return <CatalogInner courses={courses} />;
}
