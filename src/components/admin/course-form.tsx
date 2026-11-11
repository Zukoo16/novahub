"use client";

import { useState } from "react";
import { categories, type Course } from "@/lib/data";
import { Field, inputCls, selectCls, textareaCls, toLocalInput, fromLocalInput, toNum } from "./fields";
import { Button } from "../ui";
import { IconX } from "../icons";

interface FormState {
  id?: string;
  title: string;
  categoryId: string;
  level: Course["level"];
  weeks: string;
  format: Course["format"];
  price: string;
  students: string;
  rating: string;
  tag: string;
  short: string;
  description: string;
  instructorName: string;
  instructorRole: string;
  startsAt: string;
  seatsTotal: string;
  seatsTaken: string;
  syllabus: string;
}

function fromCourse(c?: Course): FormState {
  return {
    id: c?.id,
    title: c?.title ?? "",
    categoryId: c?.categoryId ?? "ai",
    level: c?.level ?? "Начальный",
    weeks: String(c?.weeks ?? 4),
    format: c?.format ?? "Онлайн",
    price: String(c?.price ?? 0),
    students: String(c?.students ?? 0),
    rating: String(c?.rating ?? 4.5),
    tag: c?.tag ?? "",
    short: c?.short ?? "",
    description: c?.description ?? "",
    instructorName: c?.instructor.name ?? "",
    instructorRole: c?.instructor.role ?? "",
    startsAt: toLocalInput(c?.startsAt ?? ""),
    seatsTotal: String(c?.seatsTotal ?? 100),
    seatsTaken: String(c?.seatsTaken ?? 0),
    syllabus: (c?.syllabus ?? []).join("\n"),
  };
}

export function CourseForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Course;
  onSubmit: (c: Omit<Course, "id"> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormState>(() => fromCourse(initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    if (f.title.trim().length < 3) {
      setError("Название обязательно (от 3 символов)");
      return;
    }
    setBusy(true);
    setError("");
    const course: Omit<Course, "id"> & { id?: string } = {
      id: f.id,
      title: f.title.trim(),
      categoryId: f.categoryId as Course["categoryId"],
      level: f.level,
      weeks: toNum(f.weeks, 4),
      format: f.format,
      price: toNum(f.price, 0),
      students: toNum(f.students, 0),
      rating: toNum(f.rating, 4.5),
      tag: f.tag.trim() || undefined,
      short: f.short.trim(),
      description: f.description.trim(),
      instructor: { name: f.instructorName.trim() || "—", role: f.instructorRole.trim() || "—" },
      syllabus: f.syllabus.split("\n").map((s) => s.trim()).filter(Boolean),
      startsAt: fromLocalInput(f.startsAt),
      seatsTotal: toNum(f.seatsTotal, 100),
      seatsTaken: toNum(f.seatsTaken, 0),
    };
    try {
      await onSubmit(course);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand/30 bg-surface-2/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">{f.id ? "Изменить курс" : "Новый курс"}</h3>
        <button onClick={onCancel} className="rounded-full p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white" aria-label="Закрыть">
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название" className="sm:col-span-2">
          <input className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="LLM и агентные системы" />
        </Field>
        <Field label="Направление">
          <select className={selectCls} value={f.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-surface">
                {c.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Уровень">
          <select className={selectCls} value={f.level} onChange={(e) => set("level", e.target.value as Course["level"])}>
            {["Начальный", "Средний", "Продвинутый"].map((l) => (
              <option key={l} value={l} className="bg-surface">
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Недель">
          <input className={inputCls} type="number" min={1} value={f.weeks} onChange={(e) => set("weeks", e.target.value)} />
        </Field>
        <Field label="Формат">
          <select className={selectCls} value={f.format} onChange={(e) => set("format", e.target.value as Course["format"])}>
            {["Онлайн", "Оффлайн", "Гибрид"].map((x) => (
              <option key={x} value={x} className="bg-surface">
                {x}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Цена, ₸ (0 = бесплатно)">
          <input className={inputCls} type="number" min={0} value={f.price} onChange={(e) => set("price", e.target.value)} />
        </Field>
        <Field label="Рейтинг">
          <input className={inputCls} type="number" step="0.1" min={0} max={5} value={f.rating} onChange={(e) => set("rating", e.target.value)} />
        </Field>
        <Field label="Тег (необязательно)">
          <input className={inputCls} value={f.tag} onChange={(e) => set("tag", e.target.value)} placeholder="Хит, Новый…" />
        </Field>
        <Field label="Дата начала">
          <input className={inputCls} type="datetime-local" value={f.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
        </Field>
        <Field label="Короткое описание">
          <input className={inputCls} value={f.short} onChange={(e) => set("short", e.target.value)} />
        </Field>
        <Field label="Студентов">
          <input className={inputCls} type="number" min={0} value={f.students} onChange={(e) => set("students", e.target.value)} />
        </Field>
        <Field label="Мест всего">
          <input className={inputCls} type="number" min={1} value={f.seatsTotal} onChange={(e) => set("seatsTotal", e.target.value)} />
        </Field>
        <Field label="Мест занято">
          <input className={inputCls} type="number" min={0} value={f.seatsTaken} onChange={(e) => set("seatsTaken", e.target.value)} />
        </Field>
        <Field label="Преподаватель (имя)">
          <input className={inputCls} value={f.instructorName} onChange={(e) => set("instructorName", e.target.value)} />
        </Field>
        <Field label="Преподаватель (роль)">
          <input className={inputCls} value={f.instructorRole} onChange={(e) => set("instructorRole", e.target.value)} />
        </Field>
        <Field label="Описание" className="sm:col-span-2">
          <textarea className={textareaCls} rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Программа (по строке на модуль)" className="sm:col-span-2">
          <textarea className={textareaCls} rows={4} value={f.syllabus} onChange={(e) => set("syllabus", e.target.value)} placeholder={"Модуль 1\nМодуль 2"} />
        </Field>
      </div>

      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      <div className="mt-5 flex gap-3">
        <Button onClick={submit} disabled={busy}>
          {busy ? "Сохраняем…" : "Сохранить"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </div>
  );
}
