import { NextResponse } from "next/server";
import { courseById, enrollUser, isEnrolled } from "@/lib/db";
import { getSessionUser } from "@/lib/session";


/** POST /api/enroll {courseId} — запись на курс (только авторизованные) */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { courseId?: string } | null;
  const courseId = body?.courseId;
  if (!courseId) {
    return NextResponse.json({ error: "Не указан курс" }, { status: 400 });
  }

  const course = courseById(courseId);
  if (!course) {
    return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
  }
  if (course.seatsTaken >= course.seatsTotal) {
    return NextResponse.json({ error: "Мест больше нет" }, { status: 409 });
  }

  enrollUser(user.id, courseId);
  return NextResponse.json({
    ok: true,
    enrolled: isEnrolled(user.id, courseId),
    courseTitle: course.title,
  });
}
