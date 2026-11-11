import { NextResponse } from "next/server";
import { listCourses, saveCourse } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { categories, type Course } from "@/lib/data";

function validCategory(id: string) {
  return categories.some((c) => c.id === id);
}

/** Список курсов (для админки) */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ courses: listCourses() });
}

/** Создание курса */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as (Omit<Course, "id"> & { id?: string }) | null;
  if (!body) return NextResponse.json({ error: "Пустое тело" }, { status: 400 });

  if (!body.title || body.title.trim().length < 3)
    return NextResponse.json({ error: "Название обязательно (от 3 символов)" }, { status: 400 });
  if (!validCategory(body.categoryId))
    return NextResponse.json({ error: "Некорректное направление" }, { status: 400 });
  if (typeof body.weeks !== "number" || body.weeks < 1)
    return NextResponse.json({ error: "Некорректная длительность" }, { status: 400 });

  const id = saveCourse(body);
  return NextResponse.json({ ok: true, id });
}
