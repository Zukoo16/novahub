import { NextResponse } from "next/server";
import { completeLesson, courseById, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

/** POST /api/courses/[id]/progress {lessonIndex} — отметить урок пройденным */
export async function POST(req: Request, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const { id } = await params;
  const course = courseById(id);
  if (!course) {
    return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
  }
  if (!isEnrolled(user.id, id)) {
    return NextResponse.json({ error: "Сначала запишитесь на курс" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as { lessonIndex?: unknown } | null;
  const lessonIndex = body?.lessonIndex;
  if (typeof lessonIndex !== "number" || !Number.isInteger(lessonIndex)) {
    return NextResponse.json({ error: "Не указан урок" }, { status: 400 });
  }

  const progress = completeLesson(user.id, id, lessonIndex);
  if (!progress) {
    return NextResponse.json({ error: "Нет доступа к этому уроку" }, { status: 403 });
  }
  return NextResponse.json({ ok: true, progress });
}
