import { NextResponse } from "next/server";
import { courseById, deleteCourse, saveCourse } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { categories, type Course } from "@/lib/data";

function validCategory(id: string) {
  return categories.some((c) => c.id === id);
}

type Params = { params: Promise<{ id: string }> };

/** Обновление курса */
export async function PUT(req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  if (!courseById(id)) return NextResponse.json({ error: "Курс не найден" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as (Omit<Course, "id"> & { id?: string }) | null;
  if (!body) return NextResponse.json({ error: "Пустое тело" }, { status: 400 });
  if (!validCategory(body.categoryId))
    return NextResponse.json({ error: "Некорректное направление" }, { status: 400 });

  const updated = saveCourse({ ...body, id });
  return NextResponse.json({ ok: true, id: updated });
}

/** Удаление курса */
export async function DELETE(_req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!courseById(id)) return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
  deleteCourse(id);
  return NextResponse.json({ ok: true });
}
