import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { enrolledCourses } from "@/lib/db";


export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const courses = enrolledCourses(user.id);
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: Boolean(user.is_admin),
      courses: courses.map((c) => ({ id: c.id, title: c.title })),
    },
  });
}
